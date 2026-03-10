export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          is_done: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          is_done?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
      };
      journal: {
        Row: {
          id: string;
          content: string;
          mood: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          content: string;
          mood?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["journal"]["Insert"]>;
      };
      frames: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          caption?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["frames"]["Insert"]>;
      };
    };
  };
}

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type JournalEntry = Database["public"]["Tables"]["journal"]["Row"];
export type Frame = Database["public"]["Tables"]["frames"]["Row"];
