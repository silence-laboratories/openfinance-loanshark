**Silent Compute:  Enhancing Trust and Data Governance in Open Finance with Privacy Preserving Compute and Auditability**


Our solution solves for trust - how to enable, enforce & audit sensitive collaborations over data between participants in Open Finance ecosystem such as Account Agreegator. Exposure of raw customer data to FIUs & TSPs broadens the exposure and misuse surface and creates a trust gap between FIPs & FIUs, resulting in hesitant and limited participation due to insufficient assurance & clarity regarding data usage and privacy concerns.


Silent Compute proposes a secure compute inference model using privacy-enhancing technologies, where FIPs are assured that FIUs can never get access to the raw data.  FIUs can just perform compute for consented customer inferences rather than moving the raw data to itself or TSPs. The cryptographic Multi-Party Computation (MPC) protocols as developed in Silent Compute allow FIUs to extract consent-bound insights from encrypted customer’s data, ensuring usage is tied to what the customer has consented for, tackling key challenges like:

![image](https://github.com/user-attachments/assets/880c769b-1228-415b-b53c-6e88d307f6bd)

1. **Privacy-preserving Computing on Encrypted Data from FIPs**: FIUs are vulnerable to single point of failure via data breaches or misuse for non-approved purposes, or compromise with utility for privacy & compliance. Our distributed compute engine eliminates exposure of plaintext raw data to FIUs, ensuring usage aligns with the purpose of data fetch & eliminating risk of data misuse or breach  while complying with key privacy principles




- Compute on Encrypted and Sharded Data ( Zero exposure of data in use and no single point of failure): Encrypted data from the FIP is sharded (split into multiple pieces—three in the proposed design) across legally isolated computing nodes, FICUs before any computation is performed. This ensures that the user's data is never exposed in plaintext to any party other than the FIP and is not stored as a whole with any single entity, thus eliminating a single point of failure. Silent Compute uses a privacy technique called Multi-Party Computation (MPC) to achieve computation on encrypted data, the details of which are discussed in next sections.

![image](https://github.com/user-attachments/assets/f6dafcfa-2b27-4e6b-8189-51b8bfc6e29f)


2. **Governance & auditability via verifiable consent**: Involvement of multiple entities, including certain unregulated participants like TSPs makes it difficult to establish clear guidelines for accountability. Furthermore, lack of transparency of data usage creates trust gaps with users. Silent Compute enhances governance & reinforces purpose limitation by marrying consent & computation to enforce consent terms in the usage of data.

- Binding Consent with Inference ( Purpose limitation-transparency and auditability): Consent is registered in form of signing of decomposed sequences of purpose-bound operation codes. Any financial inference by the FIU is performed only if the opcode sequence for the corresponding logic can be proved and verified by the consent prover. Thus, Silent Compute enables end-to-end verifiable consent that is tightly coupled with computations."


3. **Balancing socio-economic incentives**: FIUs & TSPs derive substantial value by utilising data to offer personalised services. However, FIPs and AAs do not equally share these benefits. A more equitable distribution of the value generated can be brought by a usage-based compensation model, incentivising better performance & availability from FIPs having financial outcomes directly linked directly to the quality of their service.

4. **Consesnsus for Inference:** Additionally, no single party (FIU, AA, Sahamati) can operate on user data without the permission of the other two parties. This restriction is enforced cryptographically, as user data remains entirely undefined within the scope of any individual party's view—requiring two or more parties to actively cooperate to unlock the data.
