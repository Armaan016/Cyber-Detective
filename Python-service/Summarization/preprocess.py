import pandas as pd

data = pd.read_csv(r'../Final Merged Database CSV.csv')
# print(data.head())

# print(data['Scraped Content'])

max_length = data['Scraped Content'].map(len).min() 
print(max_length)

# How can I check the maximum "words" in the "Scraped Content" column?
print(data['Scraped Content'].map(lambda x: len(x.split())).min())

# input_text = """
# Penetration testing and vulnerability scanning are both essential components of a robust cybersecurity strategy, though they serve different purposes and have distinct methodologies. Penetration testing is a targeted, manual process conducted by highly skilled professionals who use various tools, scripts, and attack techniques to identify vulnerabilities. Unlike automated tools, penetration testers customize their approach to the specific assets and risks of an organization, often uncovering new or previously unknown vulnerabilities. This testing, which can take days or weeks, is typically done annually and may cause outages. It is a high-cost, high-skill activity focused on identifying critical risks and mimicking real-world attack strategies to test a network's defenses.

# In contrast, vulnerability scanning is an automated process that identifies known vulnerabilities in network devices, servers, applications, and other infrastructure components. It does not exploit vulnerabilities but simply flags potential weaknesses, making it a valuable tool for detecting and managing risks on a broader scale. Vulnerability scans are typically run more frequently—such as weekly or monthly—and are used to quickly identify and patch known issues. While the cost of vulnerability scanning is lower than penetration testing, it does not provide the same depth of insight or confirm whether a vulnerability is exploitable. These scans are often used as part of a vulnerability management lifecycle, which feeds into patch management processes to ensure timely remediation of known vulnerabilities.

# Both methods complement each other, with vulnerability scans offering a quick overview of a network's security posture and penetration testing providing a more thorough examination. By combining the two, organizations can gain a comprehensive understanding of their security vulnerabilities and better defend against cyberattacks.
# """

# print(len(input_text))