import os
import sys
from openai import OpenAI

# Read the lines from the text file
#with open(r'C:\Users\sirdni\Documents\GitHub\birthday-card\flashcards\testing.txt', 'r') as file:
with open(sys.argv[1], 'r') as file:
    lines = file.readlines()

# Construct the prompt
prompt = "I'll give you lines that have commas in them. Everything to the left of the comma is a question and everything to the right of it is the correct answer to the question. Generate me 3 false answer choices not including the correct answer for a kahoot that are similar to the correct answers. Put it in the format 'Answer, Answer, Answer' for each line. You shouldn't have bullet points or anything else, just comma separated per line. Don't have the 'question' on the same line either. Also, don't have the explanation like 'Sure, here are the questions and answers with 3 similar but incorrect answer choices for each:' Just include the answer choices.\n\n"

# Append each line from the file to the prompt
for line in lines:
    prompt += line.strip() + "\n"

client = OpenAI(
    # This is the default and can be omitted
    api_key=sys.argv[2],
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt,
        }
    ],
    model="gpt-3.5-turbo",
)

generated_text = chat_completion.choices[0].message.content
#  Print the generated text
print(generated_text)