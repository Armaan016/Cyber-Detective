from transformers import BartForConditionalGeneration, BartTokenizer

model_path = r"C:\Users\raufu\Downloads\fine_tuned_bart"
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

input_text = """In an era of escalating digital threats, cybersecurity compliance goes beyond ticking a legal box – it’s a crucial shield safeguarding assets, reputation, and the very survival of your business

What is the most common pain point facing businesses these days? Is it supply chain fragility? Fierce competition? Tight cashflows? Or is it the rising and relentless tide of cyberattacks?

Evidence and analysts suggest it’s often the latter. As cyberthreats show no signs of slowing down, both small and large organizations increasingly recognize that cybersecurity is no longer optional.

What’s more, governments and regulatory agencies have also caught onto its importance, especially when it concerns organizations that operate in sectors that are critical to a nation’s national infrastructure. The result? An expanding set of compliance requirements that feel daunting but are essential for a country’s smooth operations and public security.

Forms of compliance

For starters, we need to distinguish between two types of compliance – compulsory and voluntary, as each brings its own set of requirements.

Compulsory compliance encompasses regulations enforced by state-level or state-adjacent agencies and targeting companies operating in critical infrastructure sectors, such as healthcare, transport, and energy. For example, a company working with patient data in the US must abide by the Health Insurance Portability and Accountability Act (HIPAA), a federal regulation, to maintain patient data privacy across state lines.

On the other hand, voluntary compliance means that businesses apply for specific certifications and standards that identify them as experts within a particular field or qualify some of their products as fulfilling a standard. For example, a company seeking environmental credibility might apply for ISO 14001 certification that demonstrates its commitment to environment-friendly practices.

However, every company needs to recognize that compliance isn’t a one-time effort. Every standard, or another “bit of compliance”, requires additional resources since these processes require consistent monitoring and budget allocations (even ISO certifications require regular re-certification).

Cybersecurity compliance – not only for security vendors

A company that doesn’t conform to compulsory compliance can face hefty fines. Incidents such as data breaches or ransomware attacks can result in extensive costs, but evidence of a failure to comply with mandated security measures can ultimately cause the final bill to go “through the roof”.

The specific cybersecurity regulations an organization needs to abide by depend on the type of industry the company operates in, and how important the security of its internal data is to privacy, data security, or critical infrastructure acts. Do also note that many regulatory acts and certifications are region-specific.

Furthermore, depending on what customers, clients, or partners a business wants to attract, it is wise to apply for a specific certificate to qualify for a contract. For example, if a company wants to work with the US federal government, it needs to apply for the FedRAMP certificate, demonstrating its competence in protecting federal data.

At any rate, compliance needs to be built into the foundations of any business strategy. As regulatory requirements keep rising in the future, well-prepared companies will have an easier time adapting to the changes, With compliance being measured continuously, this can save organizations significant resources and enable their growth in the long run.

Key cybersecurity acts and frameworks

Let’s now have a quick rundown on some of the most important cybersecurity regulatory acts and frameworks:

Health Insurance Portability and Accountability Act (HIPAA)

This regulatory act covers the handling of patient information in hospitals and other healthcare facilities. It represents a set of standards that are designed to protect confidential patient health data from being misused, requiring administrative entities to enact various safeguards to protect said data, both physically and electronically.

National Institute of Standards and Technology (NIST) frameworks

A US government agency under the Department of Commerce, NIST develops standards and guidelines for various sectors, including cybersecurity. By mandating a certain set of policies that serve as the foundation of organizational security, it enables businesses and industries to better manage their cybersecurity. For example, the NIST Cybersecurity Framework 2.0 contains comprehensive guidance for organizations of all sizes and current security posture on how they can manage and reduce their cybersecurity risks.

Payment Card Industry Data Security Standard (PCI DSS)

PCI DSS is another information security standard designed to control credit card data handling. Its goal is to reduce payment fraud risks by tightening the security surrounding cardholder data. It applies to all entities that handle card data, be it a store, a bank, or a service provider.

Network and Information Security Directive (NIS2)

This directive strengthens the cyber-resilience of critical entities in the European Union by imposing stricter security requirements and risk management practices on entities operating in sectors such as energy, transport, health, digital services and managed security services. NIS2 also introduces new incident reporting rules and fines for non-compliance.

General Data Protection Regulation (GDPR)

The GDPR is one of the strictest data privacy and security regulations globally. It focuses on the privacy and data privacy rights of people in the European Union, giving them control over their data and mandating secure storage and breach reporting for companies that manage the data.

There are both industry-specific and broad regulatory frameworks, and each comes with unique requirements. Complying with one doesn’t guarantee that you’re not in breach of another set of rules; therefore, pay attention to which regulations apply to your business and its operations.

Costly non-compliance

What about non-compliance? As mentioned previously, certain regulations institute hefty penalties.

For example, GDPR violations may result in fines of up to 10 million euros, or 2% of global annual turnover, for any company that fails to notify either a supervisory authority or the data subjects of a breach. Supervisory authorities can also slap additional fines for inadequate security measures, leading to further costs.

In the US, non-compliance with FISMA, for example, can mean reduced federal funding, government hearings, censure, lost future contracts, and more. Similarly, HIPAA violations could also have some dire consequences, be they US$1.5 million worth of fines annually and even jail time of 10 years. Clearly, there is more at stake than financial well-being.

All in all, it is better to be safe than sorry, and it’s also prudent to keep up with cybersecurity regulations specific to your industry. Rather than viewing it as an additional avoidable expense, your business should see compliance as an essential and regular investment, doubly so in the case of compulsory standards, which, if neglected, could quickly turn your business, if not life, upside down.
"""  

print("Input Text Length:", len(input_text))
final_summary = summarize_long_text(input_text)
print("Summary:", final_summary)
print("Summary Length:", len(final_summary))
