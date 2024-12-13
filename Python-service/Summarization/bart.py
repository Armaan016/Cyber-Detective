from transformers import BartForConditionalGeneration, BartTokenizer

model_path = r"D:\BART_Finetuned"
tokenizer = BartTokenizer.from_pretrained(model_path)
model = BartForConditionalGeneration.from_pretrained(model_path)

def chunk_text(text, max_length):
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:
        if current_length + len(word) + 1 > max_length:  
            chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = len(word)
        else:
            current_chunk.append(word)
            current_length += len(word) + 1

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

def summarize_chunk(chunk, max_length=200, min_length=50):
    inputs = tokenizer(chunk, max_length=1024, return_tensors="pt", truncation=True)
    summary_ids = model.generate(
        inputs["input_ids"], 
        max_length=max_length, 
        min_length=min_length, 
        length_penalty=2.0, 
        num_beams=4, 
        early_stopping=True
    )
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

def summarize_long_text(text, chunk_size=1024, max_summary_length=200, min_summary_length=50):
    chunks = chunk_text(text, chunk_size)
    print(f"Text divided into {len(chunks)} chunks.")
    
    chunk_summaries = [summarize_chunk(chunk, max_summary_length, min_summary_length) for chunk in chunks]
    
    final_input = " ".join(chunk_summaries)
    final_summary = summarize_chunk(final_input, max_length=max_summary_length, min_length=min_summary_length)
    
    return final_summary

input_text = """Penetration testing scope is typically targeted and there is always a human factor involved. There is no automated penetration testing which requires the use of tools, sometimes a lot of tools. But it also requires an extremely experienced person to conduct penetration testing. A good penetration tester always at some point during their testing craft a script, change parameters of an attack or tweak settings of the tools he or she may be using. It could be at application or network level but specific to a function, department or number of assets. One can include the whole infrastructure and all applications but that is impractical in the real world because of cost and time. You define your scope on a number of factors that are mainly based on risk and how important is an asset. Some of the penetration tester Spends a lot of money on low risk assets which may take a number of days to exploit is not practical. Penetration testing requires high skilled knowledge and that's why it is costly. Testers often exploit a new vulnerability or discover vulnerabilities that are not known to normal business processes. Penetration testing normally can take from days to a few weeks, it is often conducted once a year and reports are short and to the point. It does have a higher than average chance of causing outages. On the other hand, vulnerability scanning is the act of identifying potential vulnerabilities in network devices such as firewalls, routers, switches, servers and applications. It is automated and focuses on finding potential and know vulnerabilities on the network or an application level. It does not exploit the vulnerabilities. Vulnerability scanners only identify potential vulnerabilities they do not exploit the vulnerabilities. Hence, they are not built to find zero day exploits. The scope of vulnerability scanning is business wide, requiring automated tools to manage a high number of assets. It is wider in scope than penetration testing. Products specific knowledge is needed to effectively use the vulnerability scans product. It is usually run by administrators or security personnel with good networking knowledge. Vulnerability scans can be run frequently on any number of assets to ascertain known vulnerabilities are detected and patched. Thus, you can eliminate more serious vulnerabilities for your valuable resources quickly. An effective way to remediate vulnerabilities is to follow the vulnerability management lifecycle. The cost of a vulnerability scan is low to moderate as compared to penetration testing, and it is a detective control as opposed to preventive like penetration testing. Vulnerability management can be fed into patch management for effective patching. Patches must be tested on a test system before rolling out to production. Businesses must manually check each vulnerability before testing again Does not confirm that a vulnerability is exploitable See Also Picking Your Vulnerability Scanner The Questions You Should Ask Both tests work together to encourage optimal network and application security. Vulnerability scans are great weekly, monthly, or quarterly insight into your network security the quick Xray, while penetration tests are a very thorough way to deeply examine your network security the periodic detailed MRI. Yes, penetration tests are expensive, but you are paying a professional to examine every nook and cranny of your business the way a real world attacker would, to find a possibility of compromise. Originally published at httpscybrsecurty.blogspot.com.
"""  

print("Input Text Length:", len(input_text))
final_summary = summarize_long_text(input_text)
print("Summary:", final_summary)
print("Summary Length:", len(final_summary))
