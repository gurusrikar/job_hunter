Job Hunter
is an alexa skill to store and search for latest job openings relevant to your profile.

Job search API used: https://jobs.github.com/api

System Architecture:

A node express server to store user profile and search for jobs.
A lambda function that is triggered by alexa to do perform the business logic and respond to the user.

Lambda function code is present in the file: alexa-lambda-code.js
Alexa skill configuration is presen in the file: alexa-skill-config.txt
Rest of the files belong to the express application


Sample conversation of this skill:

Invoke the skill by uttering the word "Job Hunter". The speech response will guide you through. Following is a sample conversation.
You: Job Hunter
Alexa: Welcome to Job Hunter! Let us setup your profile.
You: My name is Max
Alexa: What is your highest level of education?
You: I am a Graduate
Alexa: How much professional work experience do you have?
You: I have 2 years of work experience
Alexa: What skills are you good at?
You: I know python
Alexa: I have saved your profile. You can ask me to look up jobs by location or by skills. For example, ask me to find jobs in San Francisco.
You: Find me jobs in San Francisco.
Alexa: <latest 5 relevant jobs in sfo, do you want to save>
You: yes

The next time you talk to job hunter it will remember your profile by your name.