import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface AlertField {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface AlertProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  fields?: AlertField[];
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  fields = [],
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) => {
  const { t } = useTranslation("common");
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
          {title}
        </h2>
        {description && (
          <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          {fields.map((field, idx) => (
            <div className="mb-4" key={field.label + idx}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded border border-gray-300 dark:border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                required={field.required}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
              disabled={loading}
            >
              {loading ? t("alert.saving") : confirmText}
            </button>
          </div>
        </form>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          onClick={onClose}
          aria-label={t("alert.close")}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
