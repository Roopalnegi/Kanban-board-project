package com.kanbanServices.suggestionServices.domain;

import java.util.List;

public class Suggestion
{
    private String prompt;        // user's message
    private List<String> suggestions;     // list of generated text from Gemini

    // empty constructor
    public Suggestion()
    {}

    // parameterized constructor
    public Suggestion(String prompt, List<String> suggestions)
    {
        this.prompt = prompt;
        this.suggestions = suggestions;
    }

    // getter and setter
    public String getPrompt() {return prompt;}
    public void setPrompt(String prompt) {this.prompt = prompt;}
    public List<String> getSuggestions() {return suggestions;}
    public void setSuggestions(List<String> suggestions) {this.suggestions = suggestions;}

    // toString()
    @Override
    public String toString() {
        return "Suggestion{" +
                "prompt='" + prompt + '\'' +
                ", suggestions='" + suggestions + '\'' +
                '}';
    }
}
