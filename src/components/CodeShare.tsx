import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const CodeShare = () => {
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [wgetCommand, setWgetCommand] = useState("");
  const { toast } = useToast();

  const generateLink = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please paste some code first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a unique ID
      const id = crypto.randomUUID();
      const name = filename.trim() || "shared-code";
      
      // Save code to Supabase
      const { error } = await supabase
        .from('code_shares')
        .insert([
          {
            id: id,
            code: code,
            filename: name
          }
        ]);

      if (error) {
        throw error;
      }

      // Generate links
      const baseUrl = window.location.origin;
      const shareLink = `${baseUrl}/share/${id}`;
      const rawLink = `${baseUrl}/raw/${id}`;
      const wget = `wget "${rawLink}" -O "${name}.txt"`;

      setGeneratedLink(shareLink);
      setWgetCommand(wget);

      toast({
        title: "Link generated!",
        description: "Your code is ready to share",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied!`,
      description: "Copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold terminal-text mb-4 glow-effect">
            WGET SHARING
          </h1>
          <p className="text-muted-foreground text-lg">
            Share code snippets with wget-friendly links
          </p>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-terminal-green" />
              Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filename Input */}
            <div>
              <label className="text-sm font-medium mb-2 block text-muted-foreground">
                Save as (optional)
              </label>
              <Input
                placeholder="my-script"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="bg-secondary"
              />
            </div>

            {/* Code Textarea */}
            <div>
              <label className="text-sm font-medium mb-2 block text-muted-foreground">
                Paste your code here
              </label>
              <Textarea
                placeholder="#!/bin/bash
echo 'Hello, World!'
# Your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="code-editor min-h-[300px] resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateLink}
              size="lg"
              className="w-full bg-terminal-green hover:bg-terminal-green/80 text-background font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Generate WGET Link
            </Button>
          </CardContent>
        </Card>

        {/* Generated Results */}
        {generatedLink && (
          <Card className="border-terminal-green/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-terminal-green">Generated Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Share Link */}
              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Share URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="code-editor flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedLink, "Link")}
                    className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-background"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* WGET Command */}
              <div>
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  WGET Command
                </label>
                <div className="flex gap-2">
                  <Input
                    value={wgetCommand}
                    readOnly
                    className="code-editor flex-1 text-terminal-cyan"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(wgetCommand, "Command")}
                    className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-background"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CodeShare;