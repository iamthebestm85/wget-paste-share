import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Download } from 'lucide-react';

const Share = () => {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      if (!id) {
        setError('Invalid share ID');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('code_shares')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          setError('Code not found');
        } else if (data) {
          setCode(data.code);
          setFilename(data.filename);
        } else {
          setError('Code not found');
        }
      } catch (err) {
        setError('Failed to load code');
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-terminal-green">Loading...</div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Code not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold terminal-text mb-4 glow-effect">
            Shared Code
          </h1>
          <p className="text-muted-foreground">
            {filename && `Filename: ${filename}`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-terminal-green" />
              Code Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="code-editor p-4 rounded-md bg-secondary whitespace-pre-wrap">
              {code}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Share;