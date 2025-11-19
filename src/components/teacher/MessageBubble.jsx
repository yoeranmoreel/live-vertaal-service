import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export default function MessageBubble({ message, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-gray-900 flex-1 leading-relaxed">{message.original_text}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {format(new Date(message.created_date), 'HH:mm')}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs">
          <span className="text-gray-500 block mb-1">🇳🇱 NL</span>
          <span className="text-gray-700">{message.translation_nl?.substring(0, 30)}...</span>
        </div>
        <div className="text-xs">
          <span className="text-gray-500 block mb-1">🇬🇧 EN</span>
          <span className="text-gray-700">{message.translation_en?.substring(0, 30)}...</span>
        </div>
        <div className="text-xs" dir="rtl">
          <span className="text-gray-500 block mb-1">🇸🇦 AR</span>
          <span className="text-gray-700">{message.translation_ar?.substring(0, 30)}...</span>
        </div>
      </div>
    </motion.div>
  );
}

