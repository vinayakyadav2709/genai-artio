"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Hash,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  Image as ImageIcon,
  Edit3,
  Settings,
  Zap,
  ShoppingBag,
  MessageSquare,
  Megaphone,
  FileEdit,
  CheckCircle,
  Edit,
  Save,
  X,
  Upload,
  Search,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Cell,
} from "recharts";

// Enhanced interfaces based on API documentation
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: AssistantResponse;
}

interface Option {
  label: string;
  id: string;
}

interface SelectionPrompt {
  prompt_id: string;
  prompt: string;
  options?: Option[];
  selection_type: "single" | "multi" | "none";
}

interface Metric {
  name: string;
  value: number;
  unit: string;
}

interface Insight {
  text: string;
  metric?: Metric;
}

interface Graph {
  title: string;
  type: "line" | "bar" | "pie" | "funnel";
  x_type: string;
  data: Array<{
    x: string;
    y: number;
    series?: string;
  }>;
}

interface Source {
  title: string;
  url: string;
}

interface Draft {
  draft_id: string;
  language: string;
  translation?: string;
  images?: string[];
  description?: string;
  hashtags?: string[];
  replacement_of?: string;
  name?: string;
  price?: number;
  category?: string;
  caption?: string;
  platforms?: string[];
  region?: string;
  budget?: number;
  headline?: string;
  duration_days?: number;
  chat_id?: string;
  message?: string;
  body_text?: string;
  call_to_action?: string;
  status?: string;
}

interface AssistantResponse {
  role: "assistant";
  turn_id: string;
  timestamp: number;
  tool_name: string;
  assistant_message: string;
  stats?: Metric[][];
  insights?: Insight[];
  charts?: Graph[];
  sources?: Source[];
  editing_enabled: boolean;
  selections?: SelectionPrompt[];
  drafts?: Draft[];
  product_id?: string;
  selections_text?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function CompleteChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI marketing assistant. I can help you create products, social media posts, ads, analyze trends, and manage customer chats. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [editingDrafts, setEditingDrafts] = useState<Record<string, Draft>>({});
  const [isEditMode, setIsEditMode] = useState<Record<string, boolean>>({});
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newHashtagInputs, setNewHashtagInputs] = useState<
    Record<string, string>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptionSelect = (
    promptId: string,
    optionId: string,
    selectionType: string
  ) => {
    if (selectionType === "single") {
      setSelectedOptions((prev) => ({ ...prev, [promptId]: [optionId] }));
    } else if (selectionType === "multi") {
      setSelectedOptions((prev) => {
        const current = prev[promptId] || [];
        const updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [promptId]: updated };
      });
    }
  };

  const handleDraftEdit = (draftId: string, field: string, value: any) => {
    setEditingDrafts((prev) => ({
      ...prev,
      [draftId]: {
        ...prev[draftId],
        [field]: value,
      },
    }));
  };

  const handleHashtagEdit = (draftId: string, hashtags: string[]) => {
    setEditingDrafts((prev) => ({
      ...prev,
      [draftId]: {
        ...prev[draftId],
        hashtags: hashtags,
      },
    }));
  };

  const addHashtag = (draftId: string, newTag: string) => {
    if (newTag && !newTag.startsWith("#")) {
      newTag = "#" + newTag;
    }
    const currentHashtags = editingDrafts[draftId]?.hashtags || [];
    if (newTag && !currentHashtags.includes(newTag)) {
      handleHashtagEdit(draftId, [...currentHashtags, newTag]);
      setNewHashtagInputs((prev) => ({ ...prev, [draftId]: "" }));
    }
  };

  const removeHashtag = (draftId: string, tagToRemove: string) => {
    const currentHashtags = editingDrafts[draftId]?.hashtags || [];
    handleHashtagEdit(
      draftId,
      currentHashtags.filter((tag) => tag !== tagToRemove)
    );
  };

  const updateHashtagInput = (draftId: string, value: string) => {
    setNewHashtagInputs((prev) => ({ ...prev, [draftId]: value }));
  };

  const startEditing = (draft: Draft) => {
    setEditingDrafts((prev) => ({ ...prev, [draft.draft_id]: { ...draft } }));
    setIsEditMode((prev) => ({ ...prev, [draft.draft_id]: true }));
  };

  const cancelEditing = (draftId: string) => {
    setEditingDrafts((prev) => {
      const newDrafts = { ...prev };
      delete newDrafts[draftId];
      return newDrafts;
    });
    setIsEditMode((prev) => ({ ...prev, [draftId]: false }));
    setNewHashtagInputs((prev) => {
      const newInputs = { ...prev };
      delete newInputs[draftId];
      return newInputs;
    });
  };

  const saveEditing = (draftId: string) => {
    setIsEditMode((prev) => ({ ...prev, [draftId]: false }));
    setNewHashtagInputs((prev) => {
      const newInputs = { ...prev };
      delete newInputs[draftId];
      return newInputs;
    });
  };

  const sendMessage = async (message: string = "") => {
    if (
      !message.trim() &&
      Object.keys(selectedOptions).length === 0 &&
      Object.keys(editingDrafts).length === 0 &&
      !uploadedImage
    )
      return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", message);

      // Format selections according to API spec
      const selections = Object.entries(selectedOptions)
        .filter(([, optionIds]) => optionIds.length > 0)
        .map(([promptId, optionIds]) => ({
          prompt_id: promptId,
          selected_option_ids: optionIds,
          selection_type: optionIds.length <= 1 ? "single" : "multi",
        }));

      formData.append("selections", JSON.stringify(selections));

      // Add drafts if there are any edits
      if (Object.keys(editingDrafts).length > 0) {
        formData.append("drafts", JSON.stringify(Object.values(editingDrafts)));
      }

      // Add image if uploaded
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      const response = await fetch("http://localhost:8000/assistant/chat", {
        method: "POST",
        body: formData,
      });

      const history = await response.json();
      const lastTurn = history[history.length - 1];

      const assistantMessage: Message = {
        id: lastTurn.turn_id || (Date.now() + 1).toString(),
        role: "assistant",
        content: lastTurn.assistant_message || "",
        timestamp: new Date(lastTurn.timestamp),
        data: lastTurn,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedOptions({});
      setEditingDrafts({});
      setIsEditMode({});
      setNewHashtagInputs({});
      removeImage();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderChart = (chart: Graph) => {
    const chartData = chart.data.map((item) => ({
      name: item.x,
      value: item.y,
      series: item.series || "default",
    }));

    switch (chart.type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLine data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: "#60a5fa", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
            </RechartsLine>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <RechartsPie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </RechartsPie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case "handle_product_helper":
        return <ShoppingBag size={16} className="text-blue-400" />;
      case "handle_post_creation":
        return <FileEdit size={16} className="text-green-400" />;
      case "handle_ad_creation":
        return <Megaphone size={16} className="text-orange-400" />;
      case "handle_chat_interaction":
        return <MessageSquare size={16} className="text-purple-400" />;
      case "handle_research":
        return <Search size={16} className="text-cyan-400" />;
      default:
        return <Settings size={16} className="text-gray-400" />;
    }
  };

  const renderEditableField = (
    draftId: string,
    field: string,
    value: any,
    placeholder: string,
    type: "text" | "textarea" | "number" = "text"
  ) => {
    const isEditing = isEditMode[draftId];
    const editValue = editingDrafts[draftId]?.[field] ?? value;

    if (!isEditing) {
      return (
        <div className="text-gray-200">
          {type === "number" && value
            ? `₹${value.toLocaleString()}`
            : value || placeholder}
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          value={editValue || ""}
          onChange={(e) => handleDraftEdit(draftId, field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none min-h-[80px]"
          rows={3}
        />
      );
    }

    if (type === "number") {
      return (
        <input
          type="number"
          value={editValue || ""}
          onChange={(e) =>
            handleDraftEdit(draftId, field, parseFloat(e.target.value) || 0)
          }
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
      );
    }

    return (
      <input
        type="text"
        value={editValue || ""}
        onChange={(e) => handleDraftEdit(draftId, field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
      />
    );
  };

  const renderHashtagEditor = (draftId: string, hashtags: string[] = []) => {
    const isEditing = isEditMode[draftId];
    const editHashtags = editingDrafts[draftId]?.hashtags || hashtags;
    const newHashtagValue = newHashtagInputs[draftId] || "";

    if (!isEditing) {
      return (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {editHashtags.map((tag, idx) => (
            <div
              key={idx}
              className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded-full text-xs flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeHashtag(draftId, tag)}
                className="hover:text-red-400"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newHashtagValue}
            onChange={(e) => updateHashtagInput(draftId, e.target.value)}
            placeholder="Add hashtag..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHashtag(draftId, newHashtagValue);
              }
            }}
          />
          <button
            onClick={() => addHashtag(draftId, newHashtagValue)}
            className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    );
  };

  const renderDraft = (
    draft: Draft,
    toolName: string,
    editingEnabled: boolean
  ) => {
    const isProduct = toolName === "handle_product_helper";
    const isPost = toolName === "handle_post_creation";
    const isAd = toolName === "handle_ad_creation";
    const isChat = toolName === "handle_chat_interaction";
    const isResearch = toolName === "handle_research";
    const isEditing = isEditMode[draft.draft_id];

    return (
      <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          {getToolIcon(toolName)}
          <span className="font-medium text-white">
            {isProduct && "Product Draft"}
            {isPost && "Social Media Post Draft"}
            {isAd && "Ad Campaign Draft"}
            {isChat && "Chat Reply Draft"}
            {isResearch && "Research Summary"}
          </span>

          {/* Status indicator */}
          {draft.status && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                draft.status === "running"
                  ? "bg-green-900/40 text-green-300"
                  : draft.status === "published"
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-gray-900/40 text-gray-300"
              }`}
            >
              {draft.status}
            </span>
          )}

          {editingEnabled && !isEditing && (
            <button
              onClick={() => startEditing(draft)}
              className="ml-auto p-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Edit size={16} />
            </button>
          )}

          {isEditing && (
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => saveEditing(draft.draft_id)}
                className="p-1 text-gray-400 hover:text-green-400 transition-colors"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => cancelEditing(draft.draft_id)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {!editingEnabled && (
            <CheckCircle size={16} className="text-green-400 ml-auto" />
          )}
        </div>

        {/* Product fields */}
        {isProduct && (
          <>
            {(draft.name || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Product Name:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "name",
                  draft.name,
                  "Enter product name"
                )}
              </div>
            )}
            {(draft.price || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Price:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "price",
                  draft.price,
                  "Enter price",
                  "number"
                )}
              </div>
            )}
            {(draft.category || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Category:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "category",
                  draft.category,
                  "Enter category"
                )}
              </div>
            )}
          </>
        )}

        {/* Ad fields */}
        {isAd && (
          <>
            {(draft.headline || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Headline:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "headline",
                  draft.headline,
                  "Enter headline"
                )}
              </div>
            )}
            {(draft.budget || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Budget:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "budget",
                  draft.budget,
                  "Enter budget",
                  "number"
                )}
              </div>
            )}
            {(draft.duration_days || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Duration (days):
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "duration_days",
                  draft.duration_days,
                  "Enter duration",
                  "number"
                )}
              </div>
            )}
            {draft.platforms && draft.platforms.length > 0 && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Platforms:
                </label>
                <div className="flex flex-wrap gap-2">
                  {draft.platforms.map((platform, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-sm capitalize"
                    >
                      {platform.replace("_ads", "").replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Chat fields */}
        {isChat && (
          <>
            {draft.translation && (
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-1">
                  English Translation:
                </p>
                <p className="text-gray-300">{draft.translation}</p>
              </div>
            )}
            {(draft.message || isEditing) && (
              <div className="mb-3">
                <label className="text-sm text-gray-400 mb-1 block">
                  Message:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "message",
                  draft.message,
                  "Enter message",
                  "textarea"
                )}
              </div>
            )}
            {draft.language && (
              <div className="mb-3">
                <span className="bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-full text-sm">
                  Language: {draft.language}
                </span>
              </div>
            )}
          </>
        )}

        {/* Common fields */}
        {(draft.description || isEditing) && (
          <div className="mb-3">
            <label className="text-sm text-gray-400 mb-1 block">
              Description:
            </label>
            {renderEditableField(
              draft.draft_id,
              "description",
              draft.description,
              "Enter description",
              "textarea"
            )}
          </div>
        )}

        {(draft.caption || isEditing) && (
          <div className="mb-3">
            <label className="text-sm text-gray-400 mb-1 block">Caption:</label>
            {renderEditableField(
              draft.draft_id,
              "caption",
              draft.caption,
              "Enter caption",
              "textarea"
            )}
          </div>
        )}

        {(draft.body_text || isEditing) && (
          <div className="mb-3">
            <label className="text-sm text-gray-400 mb-1 block">
              Body Text:
            </label>
            {renderEditableField(
              draft.draft_id,
              "body_text",
              draft.body_text,
              "Enter body text",
              "textarea"
            )}
          </div>
        )}

        {draft.images && draft.images.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="text-gray-400" size={14} />
              <span className="text-sm text-gray-400">Images</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {draft.images.map((image, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden"
                >
                  <img
                    src={`http://localhost:8002/${image}`}
                    alt={`Draft image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {(draft.hashtags && draft.hashtags.length > 0) || isEditing ? (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="text-blue-400" size={14} />
              <span className="text-sm text-blue-300">Hashtags</span>
            </div>
            {renderHashtagEditor(draft.draft_id, draft.hashtags)}
          </div>
        ) : null}

        {(draft.call_to_action || isEditing) && (
          <div className="flex justify-end">
            {isEditing ? (
              <div className="w-full">
                <label className="text-sm text-gray-400 mb-1 block">
                  Call to Action:
                </label>
                {renderEditableField(
                  draft.draft_id,
                  "call_to_action",
                  draft.call_to_action,
                  "Enter call to action"
                )}
              </div>
            ) : (
              draft.call_to_action && (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-500 transition-colors">
                  {draft.call_to_action}
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    const data = message.data;

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
      >
        <div
          className={`flex max-w-[80%] ${
            isUser ? "flex-row-reverse" : "flex-row"
          } gap-3`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-black`}
          >
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Message Content */}
          <div className="flex flex-col gap-4">
            {/* Main Message */}
            <div
              className={`p-4 rounded-2xl border ${
                isUser
                  ? "bg-stone-950 text-white border-gray-700 rounded-br-md"
                  : "bg-stone-950 text-white border-gray-700 rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>

            {/* Assistant Data Components */}
            {!isUser && data && (
              <div className="space-y-4">
                {/* Stats */}
                {data.stats &&
                  data.stats.length > 0 &&
                  Array.isArray(data.stats[0]) && (
                    <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="text-green-400" size={16} />
                        <span className="font-medium text-white">
                          Statistics
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {data.stats[0]?.map((stat, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {stat.value.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-300">
                              {stat.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Insights */}
                {data.insights && data.insights.length > 0 && (
                  <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="text-blue-400" size={16} />
                      <span className="font-medium text-white">Insights</span>
                    </div>
                    <div className="space-y-3">
                      {data.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-300 flex-1 pr-3">
                            {insight.text}
                          </span>
                          {insight.metric && (
                            <div className="bg-blue-900/40 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-blue-300">
                                {insight.metric.value.toLocaleString()}{" "}
                                {insight.metric.unit}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Charts */}
                {data.charts && data.charts.length > 0 && (
                  <div className="space-y-4">
                    {data.charts.map((chart, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-950 border border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="text-gray-400" size={16} />
                          <span className="font-medium text-white">
                            {chart.title}
                          </span>
                        </div>
                        {renderChart(chart)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Sources */}
                {data.sources && data.sources.length > 0 && (
                  <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="text-gray-400" size={16} />
                      <span className="font-medium text-white">Sources</span>
                    </div>
                    <div className="space-y-2">
                      {data.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drafts */}
                {data.drafts && data.drafts.length > 0 && (
                  <div className="space-y-4">
                    {data.drafts.map((draft, idx) => (
                      <div key={idx}>
                        {renderDraft(
                          draft,
                          data.tool_name,
                          data.editing_enabled
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selection Prompts */}
                {data.selections && data.selections.length > 0 && (
                  <div className="space-y-4">
                    {data.selections.map((selection, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-950 border border-gray-700 rounded-xl p-4"
                      >
                        <div className="mb-3">
                          <span className="font-medium text-white">
                            {selection.prompt}
                          </span>
                        </div>

                        {selection.selection_type === "none" ? (
                          <div className="text-sm text-gray-400 italic">
                            Please provide your input in the message box below.
                          </div>
                        ) : (
                          selection.options &&
                          selection.options.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selection.options.map((option) => {
                                const isSelected = selectedOptions[
                                  selection.prompt_id
                                ]?.includes(option.id);
                                return (
                                  <button
                                    key={option.id}
                                    onClick={() =>
                                      handleOptionSelect(
                                        selection.prompt_id,
                                        option.id,
                                        selection.selection_type
                                      )
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                      isSelected
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-stone-950 text-white border-gray-700 hover:bg-stone-900"
                                    } border`}
                                  >
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const hasSelections = Object.keys(selectedOptions).length > 0;
  const hasEditingDrafts = Object.keys(editingDrafts).length > 0;
  const canSend =
    inputValue.trim() || hasSelections || hasEditingDrafts || uploadedImage;

  return (
    <div className="flex flex-col h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-stone-950 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Marketing Assistant</h1>
            <p className="text-sm text-gray-300">
              Create products, posts, ads, analyze trends, and manage chats
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map(renderMessage)}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-stone-950 px-6 py-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          {/* Image preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-20 h-20 object-cover rounded-lg border border-gray-600"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    200
                  )}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full resize-none rounded-2xl border border-gray-700 bg-stone-900 text-white px-4 py-3 pr-20 
             focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-200 text-sm
             max-h-[200px] overflow-y-auto"
                rows={1}
                disabled={isLoading}
              />

              {/* Image upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-12 bottom-2 w-8 h-8 text-gray-400 hover:text-blue-400 flex items-center justify-center transition-colors duration-200"
                disabled={isLoading}
              >
                <Upload size={16} />
              </button>

              {/* Send button */}
              <button
                type="button"
                onClick={() => sendMessage(inputValue)}
                disabled={!canSend || isLoading}
                className="absolute right-2 bottom-2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send size={16} />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => sendMessage("Create a new product")}
              className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-xs hover:bg-blue-900/60 transition-colors"
              disabled={isLoading}
            >
              <ShoppingBag size={12} className="inline mr-1" />
              Create Product
            </button>
            <button
              onClick={() => sendMessage("Create a social media post")}
              className="px-3 py-1 bg-green-900/40 text-green-300 rounded-full text-xs hover:bg-green-900/60 transition-colors"
              disabled={isLoading}
            >
              <FileEdit size={12} className="inline mr-1" />
              Create Post
            </button>
            <button
              onClick={() => sendMessage("Create an ad campaign")}
              className="px-3 py-1 bg-orange-900/40 text-orange-300 rounded-full text-xs hover:bg-orange-900/60 transition-colors"
              disabled={isLoading}
            >
              <Megaphone size={12} className="inline mr-1" />
              Create Ad
            </button>
            <button
              onClick={() => sendMessage("Show me trending topics")}
              className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-xs hover:bg-cyan-900/60 transition-colors"
              disabled={isLoading}
            >
              <Search size={12} className="inline mr-1" />
              Research Trends
            </button>
            <button
              onClick={() => sendMessage("Help with customer chats")}
              className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-xs hover:bg-purple-900/60 transition-colors"
              disabled={isLoading}
            >
              <MessageSquare size={12} className="inline mr-1" />
              Chat Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
