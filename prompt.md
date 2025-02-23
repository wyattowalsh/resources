# LLM-Optimized Prompt for Resource Data Generation

## Instructions

Generate a JSON object for a resource based on the following schema. Ensure the generated data is well-structured and adheres to the schema provided.

## Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Resources",
  "type": "object",
  "properties": {
    "resources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "The title of the resource"
          },
          "description": {
            "type": "string",
            "description": "A brief description of the resource"
          },
          "url": {
            "type": "string",
            "format": "uri",
            "description": "The URL of the resource"
          },
          "notes": {
            "type": "string",
            "description": "Additional notes about the resource"
          },
          "date-last-accessed": {
            "type": "string",
            "format": "date",
            "description": "The date when the resource was last accessed"
          },
          "summary": {
            "type": "string",
            "description": "A summary of the resource"
          },
          "image": {
            "type": "string",
            "format": "uri",
            "description": "The URL of an image representing the resource"
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["documentation", "nextjs", "tailwindcss", "framer-motion", "shadcn-ui", "react", "javascript", "tutorial"]
            },
            "description": "Tags associated with the resource. New tags can be added by appending to the enum list."
          },
          "relationships": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "Relationships to other resources"
            },
            "description": "An array of relationships to other resources"
          }
        },
        "required": ["title", "description", "url"]
      }
    }
  },
  "required": ["resources"]
}
```

## Example

```json
{
  "resources": [
    {
      "title": "Next.js Documentation",
      "description": "Comprehensive guide and documentation for Next.js framework.",
      "url": "https://nextjs.org/docs",
      "notes": "Useful for learning Next.js",
      "date-last-accessed": "2023-10-01",
      "summary": "Next.js documentation",
      "image": "https://nextjs.org/static/favicon/favicon.ico",
      "tags": ["documentation", "nextjs"],
      "relationships": []
    }
  ]
}
```

## Adding New Tags

To add a new tag to the enum list, simply append the new tag to the `enum` array in the `tags` property of the schema. For example, if you want to add a new tag "typescript", update the schema as follows:

```json
"tags": {
  "type": "array",
  "items": {
    "type": "string",
    "enum": ["documentation", "nextjs", "tailwindcss", "framer-motion", "shadcn-ui", "react", "javascript", "tutorial", "typescript"]
  },
  "description": "Tags associated with the resource. New tags can be added by appending to the enum list."
}
```
