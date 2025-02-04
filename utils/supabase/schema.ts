export type EventType = {
  created_at: string;
  event_map: string | null;
  event_name: string;
  event_type: string | null;
  id: string;
  organizer: string;
  start_time: string | null;
  table_count: number;
  table_capacity: number;
  timer_chat: number;
  timer_search: number;
  timer_start: number;
  timer_wrapup: number;
  matches: Json | Record<string, string[]>;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | { [key: string]: string[] }
  | {
      id: string;
      name: string;
      ticketAs: string;
    }
  | Record<string, string[]>
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      attendees: {
        Row: {
          date_of_birth: string | null;
          email: string | null;
          id: string;
          joined_on: string;
          name: string;
          ticket_type: string | null;
        };
        Insert: {
          date_of_birth?: string | null;
          email?: string | null;
          id?: string;
          joined_on?: string;
          name: string;
          ticket_type?: string | null;
        };
        Update: {
          date_of_birth?: string | null;
          email?: string | null;
          id?: string;
          joined_on?: string;
          name?: string;
          ticket_type?: string | null;
        };
        Relationships: [];
      };
      event_attendees: {
        Row: {
          attendee_id: string;
          created_at: string;
          event_id: string;
        };
        Insert: {
          attendee_id: string;
          created_at?: string;
          event_id: string;
        };
        Update: {
          attendee_id?: string;
          created_at?: string;
          event_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_attendees_attendee_id_fkey";
            columns: ["attendee_id"];
            isOneToOne: false;
            referencedRelation: "attendees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_attendees_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      event_round_matches: {
        Row: {
          attendee_id: string;
          attendee_notes: string | null;
          created_at: string;
          event_round_id: string;
          id: number;
          location: string;
          match_info: Json;
          willShare: boolean | null;
        };
        Insert: {
          attendee_id: string;
          attendee_notes?: string | null;
          created_at?: string;
          event_round_id: string;
          id?: number;
          location: string;
          match_info: Json;
          willShare?: boolean | null;
        };
        Update: {
          attendee_id?: string;
          attendee_notes?: string | null;
          created_at?: string;
          event_round_id?: string;
          id?: number;
          location?: string;
          match_info?: Json;
          willShare?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_round_matches_attendee_id_fkey";
            columns: ["attendee_id"];
            isOneToOne: false;
            referencedRelation: "attendees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_round_matches_event_round_id_fkey";
            columns: ["event_round_id"];
            isOneToOne: false;
            referencedRelation: "event_rounds";
            referencedColumns: ["id"];
          },
        ];
      };
      event_rounds: {
        Row: {
          event_id: string;
          id: string;
          round_started_at: string;
          round_timers: number[];
        };
        Insert: {
          event_id: string;
          id?: string;
          round_started_at?: string;
          round_timers?: number[];
        };
        Update: {
          event_id?: string;
          id?: string;
          round_started_at?: string;
          round_timers?: number[];
        };
        Relationships: [
          {
            foreignKeyName: "event_rounds_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          event_map: string | null;
          event_name: string;
          event_type: string | null;
          id: string;
          matches: Json | null;
          organizer: string;
          start_time: string | null;
          table_capacity: number;
          table_count: number;
          timer_chat: number;
          timer_search: number;
          timer_start: number;
          timer_wrapup: number;
        };
        Insert: {
          created_at?: string;
          event_map?: string | null;
          event_name: string;
          event_type?: string | null;
          id?: string;
          matches?: Json | null;
          organizer?: string;
          start_time?: string | null;
          table_capacity?: number;
          table_count?: number;
          timer_chat: number;
          timer_search: number;
          timer_start?: number;
          timer_wrapup: number;
        };
        Update: {
          created_at?: string;
          event_map?: string | null;
          event_name?: string;
          event_type?: string | null;
          id?: string;
          matches?: Json | null;
          organizer?: string;
          start_time?: string | null;
          table_capacity?: number;
          table_count?: number;
          timer_chat?: number;
          timer_search?: number;
          timer_start?: number;
          timer_wrapup?: number;
        };
        Relationships: [];
      };
      round_participation: {
        Row: {
          attendee_id: string;
          created_at: string;
          event_id: string;
          is_ready: boolean;
        };
        Insert: {
          attendee_id: string;
          created_at?: string;
          event_id: string;
          is_ready?: boolean;
        };
        Update: {
          attendee_id?: string;
          created_at?: string;
          event_id?: string;
          is_ready?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "round_participation_attendee_id_fkey";
            columns: ["attendee_id"];
            isOneToOne: false;
            referencedRelation: "attendees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "round_participation_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
