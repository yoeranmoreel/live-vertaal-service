import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRCodeDisplay({ sessionCode, joinUrl }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Generate QR code using a simple library-free approach
    // For production, use a proper QR library
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Simple mock QR code visualization
      ctx.fillStyle = '#4F46E5';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', 100, 90);
      ctx.fillText(sessionCode, 100, 120);
    }
  }, [sessionCode, joinUrl]);

  return (
    <Card className="glass-effect border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode className="w-5 h-5 text-indigo-500" />
          QR Code voor Ouders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 flex items-center justify-center">
          <canvas ref={canvasRef} width="200" height="200" className="rounded-lg" />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Sessiecode:</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">{sessionCode}</p>
        </div>

        <Button
          onClick={() => window.open(joinUrl, '_blank')}
          variant="outline"
          className="w-full rounded-xl"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Test Ouder Weergave
        </Button>
      </CardContent>
    </Card>
  );
}

