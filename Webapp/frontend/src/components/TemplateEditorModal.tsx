import React, { useState, useEffect } from 'react';
import { X, Save, Copy, Eye, EyeOff, Wand2 } from 'lucide-react';
import api from '../api';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: number | string;
    title: string;
    description: string;
    category: string;
    platform: string;
    preview: string;
  } | null;
  onSave?: (editedContent: string) => void;
}

export default function TemplateEditorModal({ 
  isOpen, 
  onClose, 
  template, 
  onSave 
}: TemplateEditorModalProps) {
  const [editedContent, setEditedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (template && isOpen) {
      setEditedContent(template.preview);
      
      // Extract placeholders from template content
      const placeholderRegex = /\[([^\]]+)\]/g;
      const foundPlaceholders: string[] = [];
      let match;
      
      while ((match = placeholderRegex.exec(template.preview)) !== null) {
        if (!foundPlaceholders.includes(match[1])) {
          foundPlaceholders.push(match[1]);
        }
      }
      
      setPlaceholders(foundPlaceholders);
      
      // Initialize placeholder values
      const initialValues: Record<string, string> = {};
      foundPlaceholders.forEach(placeholder => {
        initialValues[placeholder] = '';
      });
      setPlaceholderValues(initialValues);
    }
  }, [template, isOpen]);

  const handlePlaceholderChange = (placeholder: string, value: string) => {
    setPlaceholderValues(prev => ({
      ...prev,
      [placeholder]: value
    }));
    
    // Update edited content with new placeholder value
    let updatedContent = template?.preview || '';
    Object.entries({ ...placeholderValues, [placeholder]: value }).forEach(([key, val]) => {
      if (val.trim()) {
        updatedContent = updatedContent.replace(new RegExp(`\\[${key}\\]`, 'g'), val);
      }
    });
    setEditedContent(updatedContent);
  };

  const handleSave = async () => {
    if (!template) return;
    
    setIsSaving(true);
    try {
      // Save as draft
      const response = await api.post('/content/drafts', {
        title: `${template.title} - Customized`,
        platform: template.platform,
        content: editedContent,
        contentType: template.category,
        metadata: {
          templateUsed: template.title,
          originalTemplateId: template.id
        }
      });

      if (response.data.success) {
        onSave?.(editedContent);
        onClose();
        // Show success message
        alert('Template saved as draft successfully!');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    alert('Content copied to clipboard!');
  };

  const resetToOriginal = () => {
    if (template) {
      setEditedContent(template.preview);
      const initialValues: Record<string, string> = {};
      placeholders.forEach(placeholder => {
        initialValues[placeholder] = '';
      });
      setPlaceholderValues(initialValues);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Template</h2>
            <p className="text-gray-600 mt-1">{template.title} - {template.platform}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Placeholder Editor */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Content</h3>
              
              {placeholders.length > 0 ? (
                <div className="space-y-4">
                  {placeholders.map((placeholder) => (
                    <div key={placeholder}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {placeholder.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={placeholderValues[placeholder] || ''}
                        onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                        placeholder={`Enter ${placeholder.toLowerCase()}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No placeholders found in this template.</p>
              )}

              <div className="mt-6">
                <button
                  onClick={resetToOriginal}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Reset to Original
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>

            {showPreview ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  Platform: {template.platform}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-900 whitespace-pre-wrap">{editedContent}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edit Content Directly
                  </label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Edit your content here..."
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Character count: {editedContent.length}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Content
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
