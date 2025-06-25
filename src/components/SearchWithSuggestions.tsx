
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Medicine {
  id: string;
  name: string;
  category: string;
  aliases?: string[];
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  onSelect: (medicine: Medicine) => void;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  placeholder = "Search medicines...",
  onSelect,
  value,
  onChange,
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllMedicines();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching medicines:', error);
      } else {
        setAllMedicines(data || []);
      }
    } catch (err) {
      console.error('Exception fetching medicines:', err);
    }
  };

  const fuzzyMatch = (searchTerm: string, medicine: Medicine): { score: number; matchType: string } => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return { score: 0, matchType: '' };

    const name = medicine.name.toLowerCase();
    const aliases = medicine.aliases?.map(alias => alias.toLowerCase()) || [];
    
    // Exact match gets highest score
    if (name === term) return { score: 100, matchType: 'exact' };
    
    // Check aliases for exact match
    if (aliases.some(alias => alias === term)) return { score: 95, matchType: 'alias-exact' };
    
    // Starts with match gets high score
    if (name.startsWith(term)) return { score: 90, matchType: 'starts-with' };
    
    // Check aliases for starts with
    if (aliases.some(alias => alias.startsWith(term))) return { score: 85, matchType: 'alias-starts-with' };
    
    // Contains match gets medium score
    if (name.includes(term)) return { score: 70, matchType: 'contains' };
    
    // Check aliases for contains
    if (aliases.some(alias => alias.includes(term))) return { score: 65, matchType: 'alias-contains' };
    
    // Character-by-character fuzzy match
    let score = 0;
    let termIndex = 0;
    for (let i = 0; i < name.length && termIndex < term.length; i++) {
      if (name[i] === term[termIndex]) {
        score += 1;
        termIndex++;
      }
    }
    
    if (termIndex === term.length) {
      return { score: (score / term.length) * 50, matchType: 'fuzzy' };
    }
    
    return { score: 0, matchType: '' };
  };

  const getSuggestions = (searchTerm: string): Medicine[] => {
    if (!searchTerm.trim()) return [];
    
    const matches = allMedicines
      .map(medicine => ({
        medicine,
        ...fuzzyMatch(searchTerm, medicine)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.medicine);
    
    return matches;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.trim()) {
      setIsLoading(true);
      const suggestions = getSuggestions(newValue);
      setSuggestions(suggestions);
      setShowSuggestions(true);
      setIsLoading(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (medicine: Medicine) => {
    onChange(medicine.name);
    onSelect(medicine);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (value.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10 pr-4"
          autoComplete="off"
        />
      </div>
      
      {showSuggestions && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg border"
        >
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mx-auto"></div>
                <span className="ml-2">Searching...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {suggestions.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => handleSuggestionClick(medicine)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {highlightMatch(medicine.name, value)}
                        </div>
                        {medicine.aliases && medicine.aliases.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Also known as: {medicine.aliases.join(', ')}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {medicine.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : value.trim() && (
              <div className="p-4 text-center text-gray-500">
                No medicines found for "{value}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
