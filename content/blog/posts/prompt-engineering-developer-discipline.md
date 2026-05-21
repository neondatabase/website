---
title: Prompt Engineering as a Developer Discipline
description: Structured prompting is the new coding skill every developer needs
excerpt: >-
  AI is here. That might seem like a trite comment, but almost a quarter of
  developers still see AI as something they don’t plan to use: But ‘using AI’
  doesn’t necessarily mean vibe coding your application into oblivion. Using AI
  as a developer means two things: The key to the seco...
date: '2025-04-21T19:19:58'
updatedOn: '2025-06-03T17:56:59'
category: ai
categories:
  - ai
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/prompt-engineering-developer-discipline/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Prompt Engineering as a Developer Discipline - Neon
  description: >-
    Prompting is not a guessing game but a craft rooted in logic, testing, and
    structure. Treat prompt engineering as a systematic process.
  keywords: []
  noindex: false
  ogTitle: Prompt Engineering as a Developer Discipline - Neon
  ogDescription: >-
    Prompting is not a guessing game but a craft rooted in logic, testing, and
    structure. Treat prompt engineering as a systematic process.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/prompt-engineering-developer-discipline/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/prompt-engineering-developer-discipline/neon-prompt-engineering-1-1-1024x576-f0a53379.jpg)

<br />AI is here. That might seem like a trite comment, but almost a quarter of developers still see AI as something they don’t [plan to use](https://survey.stackoverflow.co/2024/ai):

![Image](https://cdn.neonapi.io/public/images/pages/blog/prompt-engineering-developer-discipline/ad4nxc5hjjdsbkfedl0ytkmcs5npm0vlnwttagols7ltqhcjdknahwhv-r7mfx6rtpge53of35lxirfzyhg3gqq3wn948kj9lneb9tke6modpgt43det8ejwawvxe1xhmyeotocrjg-62b8d404.png)

But ‘using AI’ doesn’t necessarily mean [vibe coding](https://neon.tech/blog/tab-coding-cursor) your application into oblivion. Using AI as a developer means two things:

1. Understanding that AI is an ideal pair-programming partner
2. Understanding how to get the most out of AI to create the code you want

The key to the second is effective prompt engineering. Along with programming principles like DRY, SOLID, and other development best practices, prompt engineering is emerging as a critical skill in the modern developer’s toolkit. Great code from LLMs begins with great prompts. Just as writing clean functions or classes requires care and structure, crafting effective prompts demands methodical thinking and precision.

**Prompting is not a guessing game—it’s a craft rooted in logic, testing, and structure. The most successful developers approach prompts with the same rigor they bring to traditional code: designing, refining, and optimizing for clear outputs.**

Here, we argue that developers should treat prompts as software components—modular, testable pieces that can be evaluated, iterated on, and integrated into larger systems. When viewed through this lens, prompt engineering becomes a systematic discipline, allowing developers to harness AI with consistency and confidence.

## Few-Shot and One-Shot Prompting: Show, Don’t Just Tell

When you provide examples of the output you want, you increase the likelihood of receiving properly formatted, contextually appropriate code. This approach leverages the language model’s pattern-matching abilities.

Without an example:

<blockquote>
<p>Write a function to calculate the Fibonacci sequence.</p>
</blockquote>

Output:

````python
Here is a Python function to calculate the Fibonacci sequence up to a specified number of terms:
```python
def fibonacci(n):
    fib_sequence = [0, 1]
    for i in range(2, n):
        next_number = fib_sequence[i-1] + fib_sequence[i-2]
        fib_sequence.append(next_number)
    return fib_sequence
# Example usage
n = 10
result = fibonacci(n)
print(result)
```
This function generates the Fibonacci sequence up to the nth term and returns a list containing the sequence. You can specify the value of `n` to generate the sequence up to that term.
````

With an example:

````python
Write a function to calculate the Fibonacci sequence.

Example of another function with my preferred style:
```python
def is_prime(n: int) -> bool:
    """
    Determines if a number is prime.
    
    Args:
        n: The number to check
        
    Returns:
        True if n is prime, False otherwise
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
````

Output:

```python
def fibonacci(n: int) -> List[int]:
    """
    Generates the Fibonacci sequence up to the nth number.
    
    Args:
        n: The number of Fibonacci numbers to generate
        
    Returns:
        A list of Fibonacci numbers up to the nth number
    """
    fib_sequence = []
    a, b = 0, 1
    for _ in range(n):
        fib_sequence.append(a)
        a, b = b, a + b
    return fib_sequence
```

With the example, the model mirrors your preferred documentation style and function signature conventions. Instead of assuming defaults, it adapts to the structure you’ve provided, producing more idiomatic and integration-ready code.

## Chain-of-Thought: Induce Stepwise Reasoning

By prompting the AI to work through a problem step-by-step, you can ensure logical progression and catch potential issues before they manifest in code. This pattern is particularly valuable for complex algorithms or business logic.

With no reasoning:

<blockquote>
<p>Create a function that implements quicksort for an array of integers.</p>
</blockquote>

Output:

````python
Sure! Here is an implementation of the quicksort algorithm in Python:
```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    else:
        pivot = arr [0]
        less_than_pivot = [x for x in arr [1:] if x <= pivot]
        greater_than_pivot = [x for x in arr [1:] if x > pivot]
        return quicksort(less_than_pivot) + [pivot] + quicksort(greater_than_pivot)
# Example usage
arr = [3, 6, 8, 10, 1, 2, 1]
sorted_arr = quicksort(arr)
print(sorted_arr)
```
This function takes an array of integers as input and returns a sorted array using the quicksort algorithm.
````

With reasoning:

<blockquote>
<p>Create a function that implements quicksort for an array of integers.<br></br><br></br>Please:<br></br>First explain the quicksort algorithm and its time complexity<br></br>Then outline the key components needed in the implementation<br></br>Write the function with clear, descriptive variable names<br></br>Add appropriate error handling<br></br>Include comments explaining each major step</p>
</blockquote>

Output:

````python
### Quicksort Algorithm:
- Quicksort is a popular sorting algorithm that uses the divide-and-conquer strategy.
- It works by selecting a pivot element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.
- The process is then repeated recursively for the sub-arrays.
- The average case time complexity of quicksort is O(n log n), but it can degrade to O(n^2) in the worst case.
### Key Components for Implementation:
1. Choose a pivot element (commonly the last element in the array).
2. Partition the array around the pivot such that elements less than pivot are on the left and elements greater are on the right.
3. Recursively apply the above steps to the sub-arrays.
### Function Implementation:
```python
from typing import List
def quicksort(arr: List [int]) -> List [int]:
    """
    Sorts an array of integers using the quicksort algorithm.
    Args:
    arr (List [int]): List of integers to be sorted
    Returns:
    List [int]: Sorted list of integers
    """
    if len(arr) <= 1:
        return arr  # Base case: if array is empty or has one element, it is already sorted
    pivot = arr [-1]  # Choose last element as pivot
    smaller, equal, larger = [], [], []
    for num in arr:
        if num < pivot:
            smaller.append(num)
        elif num == pivot:
            equal.append(num)
        else:
            larger.append(num)
    return quicksort(smaller) + equal + quicksort(larger)  # Recursively sort sub-arrays and concatenate
```
### Error Handling:
- The function handles the case where the input array is empty or has only one element, in which case it simply returns the array as it is already sorted.
````

With reasoning, the model internalizes the algorithm before coding it. This leads to clearer logic, better error handling, and code that’s easier for humans to audit or extend.

## Self-Consistency: Multiple Reasoning Paths

For particularly complex problems, instructing the model to generate multiple independent solutions and then select the best one significantly improves reliability. This mimics how senior developers often approach challenging issues.

Without multiple passes:

<blockquote>
<p>Write code to detect cycles in a linked list.</p>
</blockquote>

Output:

````python
Here is a Python code snippet to detect cycles in a linked list using Floyd's Tortoise and Hare algorithm:
```python
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None
def hasCycle(head):
    if not head or not head.next:
        return False
    slow = head
    fast = head.next
    while slow!= fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    return True
```
You can use this `hasCycle` function to check if a linked list has a cycle by passing the head of the linked list as an argument. If the linked list has a cycle, the function will return `True`; otherwise, it will return `False`.
````

With multiple options:

<blockquote>
<p>Generate three different approaches to detect cycles in a linked list. For each approach:<br></br>Explain the algorithm’s logic<br></br>Analyze its time and space complexity<br></br>Implement it in code</p><p>Then, compare the approaches and recommend which one should be used in a production environment with potential memory constraints.</p>
</blockquote>

Output:

````python
### Approach 1: Using a Hash Set
#### Algorithm Logic:
- Traverse the linked list nodes one by one.
- At each node, check if the node is already present in a hash set.
- If the node is already in the hash set, there is a cycle. If not, add the node to the hash set.
- Continue this process until reaching the end of the list.
#### Time Complexity:
- Time complexity is O(n) where n is the number of nodes in the linked list.
#### Space Complexity:
- Space complexity is O(n) for the hash set storing the visited nodes.
#### Implementation:
```python
class ListNode:
    def __init__(self, value):
        self.value = value
        self.next = None
def detect_cycle_hash_set(head: ListNode) -> bool:
    visited = set()
    current = head
    while current:
        if current in visited:
            return True
        visited.add(current)
        current = current.next
    return False
```
### Approach 2: Floyd's Cycle Detection Algorithm (Two Pointers)
#### Algorithm Logic:
- Use two pointers, one slow and one fast.
- Move the slow pointer one step and the fast pointer two steps at a time.
- If there is a cycle, the slow and fast pointers will meet at some point.
#### Time Complexity:
- Time complexity is O(n) where n is the number of nodes in the linked list.
#### Space Complexity:
- Space complexity is O(1) as we are using only two pointers.
#### Implementation:
```python
def detect_cycle_floyd(head: ListNode) -> bool:
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```
### Approach 3: Reverse and Compare
#### Algorithm Logic:
- Reverse the linked list.
- Compare the reversed list with the original list.
- If they are the same, there is a cycle.
#### Time Complexity:
- Time complexity is O(n) where n is the number of nodes in the linked list.
#### Space Complexity:
- Space complexity is O(1) as we are not using any extra space.
#### Implementation:
```python
def reverse_list(head: ListNode) -> ListNode:
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev
def detect_cycle_reverse_compare(head: ListNode) -> bool:
    reversed_head = reverse_list(head)
    while head and reversed_head:
        if head == reversed_head:
            return True
        head = head.next
        reversed_head = reversed_head.next
    return False
```
### Recommendation:
- For a production environment with potential memory constraints, Floyd's Cycle Detection Algorithm (Approach 2) should be used.
- It has a low space complexity of O(1) and a time complexity of O(n), making it efficient in terms of memory usage and performance.
````

By analyzing self-consistency, you shift from accepting the first answer to evaluating multiple valid implementations. This mirrors how experienced developers consider tradeoffs before committing to a solution.

## Skeleton Prompting: Fill-in-the-Blank for Structured Control

When you need precise control over the structure of generated code, provide a skeleton that the AI can fill in. This is particularly effective for ensuring adherence to specific architectural patterns or coding standards.

With no skeleton:

<blockquote>
<p>Create a React component for a user profile page.</p>
</blockquote>

Output:

With a structure:

```javascript
Complete the following React component skeleton for a user profile page that handles loading states, errors, and displays user information:

const UserProfile = ({ userId }) => {
  // TODO: Add state for user data, loading, and errors
  
  // TODO: Add useEffect to fetch user data
  
  // TODO: Add loading state JSX
  
  // TODO: Add error state JSX
  
  // TODO: Add render method with user information display
  
  // TODO: Add any helper methods needed
}

Use TypeScript types and follow best practices for React hooks.
```

Output:

> [View the generated gist](https://gist.github.com/ajtatey/ba65b79145391f81333b6a0408295f26)

The skeleton means the AI no longer has to guess your structure—it’s filling in blanks rather than making architectural decisions. This increases alignment with standards and reduces post-generation cleanup.

## Output Schemas & Format Directives: Enforcing Structure

When integration with other systems is crucial, explicitly defining the expected output format ensures compatibility and reduces manual transformation work.

With no specific output:

````python
Generate a function that returns weather data for a given location.

# Output

Sure! Here is an example of a function in Python that retrieves weather data for a given location using the OpenWeatherMap API:
```python
import requests
def get_weather_data(api_key, location):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        weather = data ['weather'] [0] ['description']
        temp_kelvin = data ['main'] ['temp']
        temp_celsius = round(temp_kelvin - 273.15, 2)
        return f"The weather in {location} is {weather} with a temperature of {temp_celsius}°C."
    else:
        return "Failed to retrieve weather data. Please check the location and try again."
# Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
api_key = 'YOUR_API_KEY'
location = 'London'
print(get_weather_data(api_key, location))
```
Make sure to replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key. This function takes the API key and location as input parameters and returns a string with the weather description and temperature for the specified location.
````

Output:

````python
Generate a function that returns weather data for a given location.

# Output

Sure! Here is an example of a function in Python that retrieves weather data for a given location using the OpenWeatherMap API:
```python
import requests
def get_weather_data(api_key, location):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        weather = data ['weather'] [0] ['description']
        temp_kelvin = data ['main'] ['temp']
        temp_celsius = round(temp_kelvin - 273.15, 2)
        return f"The weather in {location} is {weather} with a temperature of {temp_celsius}°C."
    else:
        return "Failed to retrieve weather data. Please check the location and try again."
# Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
api_key = 'YOUR_API_KEY'
location = 'London'
print(get_weather_data(api_key, location))
```
Make sure to replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key. This function takes the API key and location as input parameters and returns a string with the weather description and temperature for the specified location.
````

With some specific JSON structuring:

```javascript
Create a function that fetches weather data for a given location. The function should return data in the following JSON structure:

{
  "location": {
    "city": "string",
    "country": "string",
    "coordinates": {
      "lat": "number",
      "long": "number"
    }
  },
  "current": {
    "temperature": "number",
    "humidity": "number",
    "windSpeed": "number",
    "conditions": "string"
  },
  "forecast": [
    {
      "date": "string (YYYY-MM-DD)",
      "highTemp": "number",
      "lowTemp": "number",
      "conditions": "string"
    }
  ]
}

Make sure to include error handling and appropriate documentation.
```

Output:

> [View the generated gist](https://gist.github.com/ajtatey/9b2d00ec46f2de63b99a1a500db473e0)

By defining the output structure, you ensure compatibility with consuming systems and reduce the need for brittle regex parsing or post-processing logic. It enforces correctness through specification.

## Configuration Parameters: Tuning Prompts Like Runtime Settings

Model settings like temperature, top-p, and max tokens don’t just change style—they reshape the type of output an LLM will return. These are runtime controls that developers should use deliberately. For example, setting temperature: 0 is ideal for deterministic, production-safe code; temperature: 0.7+ enables exploration of novel approaches or variations.

```javascript
// Example model configuration object
const modelConfigs = {
  production: {
    temperature: 0,
    top_p: 1,
    max_tokens: 1024,
    frequency_penalty: 0,
    presence_penalty: 0
  },
  exploration: {
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 2048,
    frequency_penalty: 0.3,
    presence_penalty: 0.3
  },
  creative: {
    temperature: 1.2,
    top_p: 0.8,
    max_tokens: 4096,
    frequency_penalty: 0.5,
    presence_penalty: 0.5
  }
};
```

Temperature fundamentally controls output determinism versus creativity:

| Temperature | Behavior                                   | Best For                                                      |
| ----------- | ------------------------------------------ | ------------------------------------------------------------- |
| 0.0         | Completely deterministic                   | Production code generation, SQL queries, data transformations |
| 0.1 – 0.4   | Mostly deterministic with slight variation | Documentation generation, explanatory comments                |
| 0.5 – 0.7   | Balanced determinism and creativity        | Design patterns, architecture suggestions                     |
| 0.8 – 1.0   | Increasingly creative responses            | UI/UX ideas, alternative implementations                      |
| > 1.0       | Highly creative, potentially erratic       | Brainstorming sessions, unconventional approaches             |

Consider this example of the same prompt with different temperature settings:

```python
# Same prompt, different temperatures
"""
prompt = Write a function to calculate the Fibonacci sequence optimized for performance.;
"""

# Temperature: 0.0
# Result: Consistent, standard memoized solution
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]
# Example usage
n = 10
result = fibonacci(n)
print(f"The {n}th Fibonacci number is: {result}")

# Temperature: 0.7
# Result: Potentially alternative approaches
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# 2nd run at 0.7
def fibonacci(n):
    memo = {}
    def fib_helper(n):
        if n in memo:
            return memo[n]
        if n <= 1:
            return n
        else:
            result = fib_helper(n - 1) + fib_helper(n - 2)
            memo[n] = result
            return result
    return fib_helper(n)
# Example usage
n = 10
print(fibonacci(n))  # Output: 55
```

By adjusting temperature (or max tokens or top_p), you can identify the right model parameters for your coding style and needs.

## Prompt Anatomy: Structure Your Inputs Like Interfaces

Every effective prompt has identifiable sections—persona, task, context, output format, and examples. Breaking prompts down into these components improves clarity and makes them easier to version, document, and reuse. This is the interface layer between you and the model.

A well-structured prompt can be decomposed into distinct components:

1. Persona: The role or expertise level you want the AI to emulate
2. Task: The specific action or output you’re requesting
3. Context: Background information or constraints
4. Output Structure: The format and organization of the response
5. Examples: Demonstrations of desired outputs (few-shot learning)

A component-based system allows you to mix and match pre-defined modules rather than crafting these elements from scratch each time.

### Component Library Example

Here’s how a component-based prompt system might look in practice:

```javascript
// Personas
const personas = {
  backendExpert: `You are a senior backend developer with 15+ years of experience 
                  specializing in distributed systems and API design. You prioritize 
                  scalability, security, and maintainability in all your code.`,
  
  securitySpecialist: `You are a cybersecurity expert with deep knowledge of 
                       application security, threat modeling, and secure coding practices. 
                       You always identify potential vulnerabilities in code.`
};

// Output Formats
const formats = {
  json: `Return your response as a valid JSON object without any additional explanation.`,
  
  markdown: `Format your response as markdown with appropriate headings, 
             code blocks with language tags, and bullet points where relevant.`
};

// Task Templates
const tasks = {
  codeReview: `Review the following code for {aspect} issues:
               
               \`\`\`{language}
               {code}
               \`\`\`
               
               Focus particularly on {focus_area}.`,
  
  implementation: `Write {language} code that implements {feature} with the 
                   following requirements:
                   
                   {requirements}`
};

// Composing a complete prompt
function createPrompt(components) {
  return [
    components.persona,
    components.task,
    components.format
  ].join('\n\n');
}

// Usage
const securityReviewPrompt = createPrompt({
  persona: personas.securitySpecialist,
  task: tasks.codeReview
    .replace('{aspect}', 'security')
    .replace('{language}', 'python')
    .replace('{code}', userCode)
    .replace('{focus_area}', 'input validation and SQL injection'),
  format: formats.markdown
});
```

This component-based approach delivers several advantages:

1. Consistency: Standardized components ensure uniform outputs across your application
2. Maintainability: Update a component once to affect all prompts using it
3. Version Control: Track changes to prompt components like any other code
4. Collaboration: Teams can share and reuse components across projects
5. Testing: Validate individual components for reliability
6. Documentation: Self-documenting prompt architecture

## Prompt Linting: Validate Structure Before Execution

Just as developers rely on linters to catch code issues before runtime, prompt engineers need automated quality checks to identify structural problems before execution. Before launching your prompts into production, validating them for clarity, completeness, and consistency can dramatically improve reliability and reduce debugging time.

### The Case for Prompt Linting

Prompts are susceptible to several classes of structural issues:

- Ambiguous instructions: Directions that can be interpreted multiple ways
- Conflicting constraints: Requirements that contradict each other
- Missing format directives: Unclear expectations for output structure
- Forgotten variables: Template placeholders that weren’t replaced
- Insufficient examples: Few-shot patterns without enough cases
- Unclear personas: Vague role descriptions for the model

### LLM-Powered Self-Linting

The most powerful approach to prompt validation is using the LLM as a linting tool. This meta-use of AI leverages the model’s own understanding of language and reasoning to identify potential issues:

```javascript
// LLM-based prompt self-linting
async function selfLintPrompt(prompt, model) {
  const metaPrompt = `
    You are a prompt engineering expert tasked with analyzing and improving prompts.
    
    Review the following prompt for:
    1. Clarity of instructions
    2. Potential ambiguities
    3. Structural issues
    4. Missing constraints or format specifications
    5. Consistency of requirements
    
    Provide your analysis in JSON format with the following structure:
    {
      "overallQuality": number, // 1-10 score
      "issues": [
        {
          "type": string, // One of: "ambiguity", "structure", "contradiction", "missing", "other"
          "severity": string, // One of: "error", "warning", "suggestion"
          "description": string,
          "recommendation": string
        }
      ],
      "improvedVersion": string // The revised prompt
    }
    
    Here is the prompt to analyze:
    
    """
    ${prompt}
    """
    
    Provide ONLY the JSON output without any additional text.
  `;
  
  const analysisResult = await model.complete(metaPrompt, { temperature: 0.1 });
  
  try {
    return JSON.parse(analysisResult);
  } catch (e) {
    return {
      error: "Failed to parse LLM output as JSON",
      rawOutput: analysisResult
    };
  }
}
```

If we gave it this prompt to lint:

> Generate a React component that displays user information from an API. Make it look good and add some nice features if possible.
>
> [View the generated gist](https://gist.github.com/ajtatey/5a500d536a6ab5b01c80feec4762cf89)

Which would then produce this code:

> [View the generated gist](https://gist.github.com/ajtatey/4be3cd7bfc548767d8aa78c213c49438)

In this way, we get LLMs to produce better and better prompts, leading to better and better code.

## Prompts Are Code

Prompt engineering is becoming a proper developer discipline with patterns, tools, and methodologies just like any other area of coding. You wouldn’t write a function without tests, so why would you deploy a prompt without validation? You version control your code, so shouldn’t you do the same with your prompts? The parallels are everywhere.

What makes this approach powerful is how it leverages existing software development practices. Few-shot examples are basically test cases. Chain-of-thought is like forcing the model to show its work. Skeleton prompting gives you the same control as template patterns in traditional code. And when you apply these techniques consistently, the unpredictability that makes people nervous about AI starts to melt away. You can confidently ship AI-powered features knowing they’ll behave as expected, just like any other component in your system.

Stop treating your prompts like throwaway strings. Build them like software, test them like software, and maintain them like software–and watch your AI interactions become as reliable as the rest of your codebase.

---

_Neon is the serverless Postgres database [used by Replit Agent and Create.xyz](https://neon.tech/blog/provision-postgres-neon-api) to provision databases when building apps. It also works like a charm with Cursor and Windsurf [via its MCP Server](https://neon.tech/guides/cursor-mcp-neon)._

<Admonition type="note" title="Try Neon - $100 on us">
If you haven't tried Neon yet, [sign up via this link](https://fyi.neon.tech/credits) and get $100 in credits.
</Admonition>
