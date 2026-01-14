import os
from typing import Literal

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import START, END, StateGraph
from app.schemas.agent import PipelineState, ClassificationOutput

load_dotenv()


DEFAULT_UNPRODUCTIVE_RESPONSE = (
    "Agradecemos o seu contato. Esta mensagem foi classificada como não requerendo ação. "
    "Caso tenha uma solicitação específica, por favor envie um novo email detalhando sua necessidade."
)


class EmailAssistantPipeline:
    """Pipeline for email classification and response generation using LangGraph."""

    def __init__(self, model: str = "llama-3.3-70b-versatile", temperature: float = 0.7):
        """
        Initialize the pipeline with Groq LLM.

        Args:
            model: The Groq model to use (default: llama-3.3-70b-versatile)
            temperature: Temperature for LLM responses (default: 0.7)
        """
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "API key required for Groq API. "
                "Provide GROQ_API_KEY environment variable."
            )

        self.llm = ChatGroq(
            model=model,
            api_key=api_key,
            temperature=temperature,
        )

        self.graph = self._build_graph()
    
    def _classify_email(self, state: PipelineState) -> PipelineState:
        """Node: Classify email as productive or unproductive."""
        structured_llm = self.llm.with_structured_output(ClassificationOutput)

        result = structured_llm.invoke(
            f"""Analyze the following email and classify it.

            An email is PRODUCTIVE if it:
            - Requests status of a pending request
            - Asks a relevant business question
            - Shares important documents or information
            - Requires some action or response

            An email is UNPRODUCTIVE if it:
            - Is a greeting or holiday message (e.g., Merry Christmas, Happy New Year)
            - Contains spam or irrelevant content
            - Is a generic thank you without any request

            Email:
            {state.email_text}

            Classify this email and provide your confidence level."""
        )

        state.is_productive = result.is_productive
        state.confidence = result.confidence
        return state
    
    def _route_by_classification(self, state: PipelineState) -> Literal["generate_response", "default_response"]:
        """Conditional edge: Route based on classification."""
        if state.is_productive:
            return "generate_response"
        return "default_response"
    
    def _generate_response(self, state: PipelineState) -> PipelineState:
        """Node: Generate response for productive emails using LLM."""
        response = self.llm.invoke(
            f"""You are a helpful assistant for a financial company.
            Generate a professional and helpful response to the following email.
            Keep the response concise and in Portuguese (Brazil).

            Email:
            {state.email_text}

            Response:"""
        )

        state.suggested_response = response.content
        return state
    
    def _default_response(self, state: PipelineState) -> PipelineState:
        """Node: Return default response for unproductive emails (no LLM call)."""
        state.suggested_response = DEFAULT_UNPRODUCTIVE_RESPONSE
        return state
    
    def _build_graph(self):
        """Build and compile the LangGraph pipeline."""
        graph = StateGraph(PipelineState)

        graph.add_node("classify", self._classify_email)
        graph.add_node("generate_response", self._generate_response)
        graph.add_node("default_response", self._default_response)

        graph.add_edge(START, "classify")
        graph.add_conditional_edges("classify", self._route_by_classification)
        graph.add_edge("generate_response", END)
        graph.add_edge("default_response", END)

        return graph.compile()
    
    def invoke(self, state: PipelineState) -> dict:
        """
        Process email through the pipeline.
        
        Args:
            state: Initial pipeline state with email_text
            
        Returns:
            Dictionary with is_productive, confidence and suggested_response
        """
        result = self.graph.invoke(state)
        return {
            "is_productive": result["is_productive"],
            "confidence": result["confidence"],
            "suggested_response": result["suggested_response"],
        }

pipeline = EmailAssistantPipeline()
