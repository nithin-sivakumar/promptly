import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Sparkles,
  Code,
  FileText,
  Bot,
  ArrowLeft,
  Copy,
  Check,
  MessageCircle,
  Zap,
  Target,
  Settings,
  Play,
} from "lucide-react";

const templates = [
  {
    id: "json-agent",
    title: "JSON-Only Agent",
    icon: <Code className="text-emerald-400" />,
    description:
      "Generate agents that return clean, parseable JSON—no fluff, just structure.",
    color: "from-emerald-400 to-teal-500",
    category: "Structured Output",
  },
  {
    id: "summarization",
    title: "Smart Summarizer",
    icon: <FileText className="text-blue-400" />,
    description:
      "Perfectly balanced summarization prompts with context control and tone guidance.",
    color: "from-blue-400 to-indigo-500",
    category: "Content Processing",
  },
  {
    id: "keyword-agent",
    title: "Keyword Extractor",
    icon: <Target className="text-pink-400" />,
    description:
      "Design agents that always return key terms, formatted just right.",
    color: "from-pink-400 to-rose-500",
    category: "Data Extraction",
  },
  {
    id: "conversational",
    title: "Conversational Agent",
    icon: <MessageCircle className="text-purple-400" />,
    description:
      "Create engaging conversational AI with personality and context awareness.",
    color: "from-purple-400 to-violet-500",
    category: "Interaction",
  },
  {
    id: "analytical",
    title: "Data Analyst",
    icon: <Zap className="text-yellow-400" />,
    description: "Build prompts for deep data analysis and insight generation.",
    color: "from-yellow-400 to-orange-500",
    category: "Analytics",
  },
  {
    id: "custom",
    title: "Custom Agent",
    icon: <Settings className="text-cyan-400" />,
    description:
      "Start from scratch with guided prompt engineering assistance.",
    color: "from-cyan-400 to-blue-500",
    category: "Custom",
  },
];

const steps = [
  { id: 1, title: "Choose Template", desc: "Select your agent type" },
  { id: 2, title: "Configure", desc: "Fine-tune parameters" },
  { id: 3, title: "Test & Refine", desc: "Validate your prompt" },
  { id: 4, title: "Deploy", desc: "Get production-ready code" },
];

const Home = () => {
  const [currentView, setCurrentView] = useState("landing"); // landing, builder, result
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [refinementQuestions, setRefinementQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const topRef = useRef(null);

  useEffect(() => {
    if (topRef) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentView]);

  // Simulate typing effect for generated prompt
  useEffect(() => {
    if (generatedPrompt && currentView === "result") {
      const text = generatedPrompt;
      setGeneratedPrompt("");
      let i = 0;
      const timer = setInterval(() => {
        setGeneratedPrompt(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(timer);
      }, 20);
      return () => clearInterval(timer);
    }
  }, [currentView]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentView("builder");
    setCurrentStep(2);

    // Generate refinement questions based on template
    const questions = generateRefinementQuestions(template.id);
    setRefinementQuestions(questions);
  };

  const generateRefinementQuestions = (templateId) => {
    const questionSets = {
      "json-agent": [
        {
          id: "output_format",
          question: "What specific JSON structure do you need?",
          type: "textarea",
        },
        {
          id: "required_fields",
          question: "Which fields are mandatory?",
          type: "text",
        },
        {
          id: "validation_rules",
          question: "Any validation rules or constraints?",
          type: "textarea",
        },
      ],
      summarization: [
        {
          id: "length",
          question: "Preferred summary length?",
          type: "select",
          options: [
            "Brief (1-2 sentences)",
            "Medium (1 paragraph)",
            "Detailed (2-3 paragraphs)",
          ],
        },
        {
          id: "tone",
          question: "What tone should the summary have?",
          type: "select",
          options: ["Professional", "Casual", "Academic", "Creative"],
        },
        {
          id: "focus",
          question: "What aspects should be emphasized?",
          type: "textarea",
        },
      ],
      "keyword-agent": [
        {
          id: "keyword_count",
          question: "How many keywords should be extracted?",
          type: "number",
        },
        {
          id: "keyword_type",
          question: "What type of keywords?",
          type: "select",
          options: ["General topics", "Technical terms", "Entities", "Actions"],
        },
        {
          id: "format",
          question: "How should keywords be formatted?",
          type: "select",
          options: ["Comma-separated", "JSON array", "Bullet points"],
        },
      ],
      conversational: [
        {
          id: "personality",
          question: "What personality should the agent have?",
          type: "textarea",
        },
        {
          id: "context_memory",
          question: "Should it remember conversation history?",
          type: "select",
          options: ["Yes", "No"],
        },
        {
          id: "response_style",
          question: "Preferred response style?",
          type: "select",
          options: ["Concise", "Detailed", "Conversational", "Professional"],
        },
      ],
      analytical: [
        {
          id: "analysis_type",
          question: "What type of analysis is needed?",
          type: "select",
          options: [
            "Statistical",
            "Trend analysis",
            "Comparative",
            "Predictive",
          ],
        },
        {
          id: "output_format",
          question: "How should insights be presented?",
          type: "select",
          options: [
            "Bullet points",
            "Narrative",
            "Structured report",
            "Key metrics",
          ],
        },
        {
          id: "depth",
          question: "Level of detail required?",
          type: "select",
          options: [
            "High-level overview",
            "Detailed analysis",
            "Deep dive with recommendations",
          ],
        },
      ],
      custom: [
        {
          id: "purpose",
          question: "What is the main purpose of your agent?",
          type: "textarea",
        },
        {
          id: "input_type",
          question: "What type of input will it receive?",
          type: "textarea",
        },
        {
          id: "output_requirements",
          question: "What should the output look like?",
          type: "textarea",
        },
      ],
    };
    return questionSets[templateId] || [];
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep(3);

    // Simulate API call
    setTimeout(() => {
      const mockPrompt = generateMockPrompt(
        selectedTemplate,
        userPrompt,
        answers
      );
      setGeneratedPrompt(mockPrompt);
      setCurrentView("result");
      setIsGenerating(false);
      setCurrentStep(4);
    }, 2000);
  };

  const generateMockPrompt = (template, userInput, userAnswers) => {
    const basePrompts = {
      "json-agent": `You are a specialized JSON generation agent. Your task is to process the given input and return a valid JSON response that follows the specified schema.

CRITICAL INSTRUCTIONS:
- Always return valid JSON format
- Include all required fields: ${
        userAnswers.required_fields || "id, content, metadata"
      }
- Never include explanatory text outside the JSON
- Validate data according to: ${
        userAnswers.validation_rules || "standard validation rules"
      }

JSON SCHEMA:
${
  userAnswers.output_format ||
  '{"id": "string", "content": "string", "metadata": {}}'
}

USER REQUEST: ${userInput}

Remember: Return ONLY valid JSON, no additional text or explanations.`,

      summarization: `You are an expert summarization agent designed to create ${
        userAnswers.length || "medium-length"
      } summaries with a ${userAnswers.tone || "professional"} tone.

SUMMARIZATION GUIDELINES:
- Length: ${userAnswers.length || "Medium (1 paragraph)"}
- Tone: ${userAnswers.tone || "Professional"}
- Focus areas: ${userAnswers.focus || "Main themes and key insights"}
- Maintain factual accuracy
- Preserve essential context
- Use clear, concise language

TASK: ${userInput}

Provide a well-structured summary that captures the essence while meeting the specified requirements.`,

      "keyword-agent": `You are a keyword extraction specialist. Extract exactly ${
        userAnswers.keyword_count || "5-10"
      } relevant ${userAnswers.keyword_type || "general topic"} keywords.

EXTRACTION RULES:
- Number of keywords: ${userAnswers.keyword_count || "5-10"}
- Keyword type: ${userAnswers.keyword_type || "General topics"}
- Format: ${userAnswers.format || "Comma-separated"}
- Focus on most relevant and specific terms
- Avoid generic or overly broad terms
- Maintain semantic relevance

INPUT: ${userInput}

Extract keywords following the specified format and requirements.`,
    };

    return (
      basePrompts[template.id] ||
      `You are an AI assistant designed to help with: ${userInput}

Please provide a comprehensive and helpful response that addresses the user's needs effectively.`
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetApp = () => {
    setCurrentView("landing");
    setSelectedTemplate(null);
    setUserPrompt("");
    setGeneratedPrompt("");
    setCurrentStep(1);
    setAnswers({});
    setRefinementQuestions([]);
  };

  if (currentView === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-8">
          <button
            onClick={resetApp}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Production-Ready Prompt
              </h1>
              <p className="text-gray-300">
                Optimized for {selectedTemplate?.title}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Generated System Prompt
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-green-400">
                  {generatedPrompt}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentView("builder")}
                className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">Refine Further</h3>
                <p className="text-blue-100">
                  Make additional adjustments to perfect your prompt
                </p>
              </button>

              <button
                onClick={resetApp}
                className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">Create Another</h3>
                <p className="text-emerald-100">
                  Start fresh with a new prompt template
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "builder") {
    return (
      <div
        ref={topRef}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 p-8">
          <button
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= step.id ? "bg-purple-600" : "bg-gray-700"
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="ml-2 hidden md:block">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-400">{step.desc}</div>
                  </div>
                  {step.id < steps.length && (
                    <div
                      className={`w-12 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-purple-600" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${selectedTemplate?.color} mb-4`}
              >
                {React.cloneElement(selectedTemplate.icon, {
                  size: 24,
                  className: "text-white",
                })}
                <h1 className="text-2xl font-bold text-white">
                  {selectedTemplate?.title}
                </h1>
              </div>
              <p className="text-gray-300">{selectedTemplate?.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Describe Your Use Case
                  </h3>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Describe what you want your AI agent to do..."
                    className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Refinement Questions */}
                {refinementQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6"
                  >
                    <label className="block text-sm font-medium mb-2">
                      {question.question}
                    </label>
                    {question.type === "textarea" && (
                      <textarea
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                      />
                    )}
                    {question.type === "text" && (
                      <input
                        type="text"
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                    )}
                    {question.type === "number" && (
                      <input
                        type="number"
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                    )}
                    {question.type === "select" && (
                      <select
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: e.target.value,
                          }))
                        }
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="">Select an option</option>
                        {question.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Preview Panel */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">Prompt Preview</h3>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 min-h-64">
                  {userPrompt ? (
                    <div>
                      <div className="text-purple-400 mb-2">
                        // Preview based on your inputs
                      </div>
                      <div className="text-green-400">
                        Building {selectedTemplate?.title.toLowerCase()} for: "
                        {userPrompt.substring(0, 100)}..."
                      </div>
                      <div className="text-gray-500 mt-4">
                        Click "Generate Prompt" to see the full optimized system
                        prompt
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      Start typing your use case to see a preview...
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!userPrompt.trim() || isGenerating}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-all cursor-pointer ${
                    !userPrompt.trim() || isGenerating
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Play size={16} />
                      Generate Prompt
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-12 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-purple-900/50 backdrop-blur-lg border border-purple-500/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="text-purple-400" size={20} />
            <span className="text-purple-200">
              AI-Powered Prompt Engineering
            </span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
            Craft Perfect Prompts
            <br />
            <span className="text-4xl lg:text-5xl">for Production AI</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform your rough ideas into battle-tested, production-ready
            system prompts. Handle edge cases, ensure consistency, and deploy
            with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setCurrentView("builder")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Start Building Prompts
            </button>
            <button className="px-8 py-4 border border-white/20 hover:bg-white/10 rounded-xl text-white transition-all duration-300 backdrop-blur-lg cursor-pointer">
              View Examples
            </button>
          </div>
        </div>

        {/* Template Cards */}
        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Agent Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group cursor-pointer bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-700/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${template.color}`}
                  >
                    {React.cloneElement(template.icon, {
                      size: 24,
                      className: "text-white",
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-purple-300 transition-colors">
                      {template.title}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-sm font-medium">Get Started</span>
                  <ChevronRight
                    size={16}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-300">
              Professional-grade prompt engineering made simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="text-purple-400" size={32} />,
                title: "AI-Assisted Refinement",
                desc: "Our AI asks the right questions to optimize your prompts automatically",
              },
              {
                icon: <Zap className="text-yellow-400" size={32} />,
                title: "Production Ready",
                desc: "Get prompts that handle edge cases and work reliably in production",
              },
              {
                icon: <Target className="text-green-400" size={32} />,
                title: "Template Library",
                desc: "Start with proven templates for common AI agent patterns",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50"
              >
                <div className="inline-flex p-4 bg-gray-700/50 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl border border-purple-500/30 p-12 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Better Prompts?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers creating production-ready AI agents
          </p>
          <button
            onClick={() => setCurrentView("builder")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Start Your First Prompt
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;
