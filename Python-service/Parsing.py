from urllib.request import urlopen
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_paragraph = False
        self.paragraphs = []
        
    def handle_starttag(self, tag, attrs):
        if tag == 'p':
            self.in_paragraph = True
            
    def handle_endtag(self, tag):
        if tag == 'p':
            self.in_paragraph = False
            
    def handle_data(self, data):
        if self.in_paragraph:
            self.paragraphs.append(data.strip())
            
url = 'https://www.cisco.com/site/us/en/learn/topics/security/what-is-cybersecurity.html#:~:text=Cybersecurity%20is%20the%20practice%20of,or%20interrupting%20normal%20business%20processes'

response = urlopen(url)
html_content = response.read().decode('utf-8')
parser = MyHTMLParser()
parser.feed(html_content)

for para in parser.paragraphs:
    print(para)