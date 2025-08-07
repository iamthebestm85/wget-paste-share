import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Raw = () => {
  const { id } = useParams<{ id: string }>();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCode = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('code_shares')
          .select('code')
          .eq('id', id)
          .single();

        if (error) {
          setCode('Code not found');
        } else {
          setCode(data.code);
        }
      } catch (err) {
        setCode('Failed to load code');
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Return raw text with correct headers for wget
  useEffect(() => {
    if (code !== null) {
      // Set headers for plain text download
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.fontFamily = 'monospace';
      document.body.style.whiteSpace = 'pre-wrap';
      document.body.style.background = 'white';
      document.body.style.color = 'black';
    }
  }, [code]);

  return <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{code || 'Code not found'}</div>;
};

export default Raw;