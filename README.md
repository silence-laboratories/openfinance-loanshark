**Silent Compute: Enhancing Trust and Data Governance in Open Finance with Privacy Preserving Compute and Auditability**

Our solution solves for trust - how to enable, enforce & audit sensitive collaborations over data between participants in Open Finance ecosystem such as Account Agreegator. Exposure of raw customer data to FIUs & TSPs broadens the exposure and misuse surface and creates a trust gap between FIPs & FIUs, resulting in hesitant and limited participation due to insufficient assurance & clarity regarding data usage and privacy concerns.

Silent Compute proposes a secure compute inference model using privacy-enhancing technologies, where FIPs are assured that FIUs can never get access to the raw data. FIUs can just perform compute for consented customer inferences rather than moving the raw data to itself or TSPs. The cryptographic Multi-Party Computation (MPC) protocols as developed in Silent Compute allow FIUs to extract consent-bound insights from encrypted customer’s data, ensuring usage is tied to what the customer has consented for, tackling key challenges like:

![image](https://github.com/user-attachments/assets/880c769b-1228-415b-b53c-6e88d307f6bd)

1. **Privacy-preserving Computing on Encrypted Data from FIPs**: FIUs are vulnerable to single point of failure via data breaches or misuse for non-approved purposes, or compromise with utility for privacy & compliance. Our distributed compute engine eliminates exposure of plaintext raw data to FIUs, ensuring usage aligns with the purpose of data fetch & eliminating risk of data misuse or breach while complying with key privacy principles

- Compute on Encrypted and Sharded Data ( Zero exposure of data in use and no single point of failure): Encrypted data from the FIP is sharded (split into multiple pieces—three in the proposed design) across legally isolated financial information computing nodes, FICUs, before any computation is performed. This ensures that the user's data is never exposed in plaintext to any party other than the FIP and is not stored as a whole with any single entity, thus eliminating a single point of failure. Silent Compute uses a privacy technique called Multi-Party Computation (MPC) to achieve computation on encrypted data, all without any protocol modifications at FIPs or AA.

![image](https://github.com/user-attachments/assets/f6dafcfa-2b27-4e6b-8189-51b8bfc6e29f)

 <div style="text-align: center;">
    <figure>
        <img src="https://github.com/user-attachments/assets/81de190b-d018-4e85-8914-fb0f7a8c4bda" alt="Image 124 width="200"/>
        <figcaption>Secret sharing of ciphertext E across multiple nodes </figcaption>
    </figure>
</div>

2. **Governance & auditability via verifiable consent**: The involvement of multiple entities, including certain unregulated participants like TSPs makes it difficult to establish clear guidelines for accountability. Furthermore, lack of transparency of data usage creates trust gaps with users. Silent Compute enhances governance & reinforces purpose limitation by marrying consent & computation to enforce consent terms in the usage of data.

- Binding Consent with Inference ( Purpose limitation-transparency and auditability): Consent is registered in form of signing of decomposed sequences of purpose-bound operation codes. Any financial inference by the FIU is performed only if the opcode sequence for the corresponding logic can be proved and verified by the consent prover. Thus, Silent Compute enables end-to-end verifiable consent that is tightly coupled with computations."

3. **Balancing socio-economic incentives**: FIUs & TSPs derive substantial value by utilising data to offer personalised services. However, FIPs and AAs do not equally share these benefits. A more equitable distribution of the value generated can be brought by a usage-based compensation model, incentivising better performance & availability from FIPs having financial outcomes directly linked directly to the quality of their service.

4. **Consesnsus for Inference:** Additionally, no single party (FIU, AA, Sahamati) can operate on user data without the permission of the other two parties. This restriction is enforced cryptographically, as user data remains entirely undefined within the scope of any individual party's view—requiring two or more parties to actively cooperate to unlock the data.

![image](https://github.com/user-attachments/assets/f6dafcfa-2b27-4e6b-8189-51b8bfc6e29f)

Figure, above, shows the revised workflow of financial information request. Our proposal is to _distribute_ the storage of the key ephemeral key, $\mathsf{sk}$, amongst Financial Information Compute Unit (FICU) nodes. In practice, as an example in context of this white paper, these compute nodes can be operated by AA, FIU, and Sahamati, each running one instance. Let's see the adaptations in context of the existing workflow.

- **A. Initiating a Data Request with Distributed Key Generation (DKG):**
  As shown in Figure 14, after the user’s consent is obtained, the FIU sends a Financial Information (FI) request to the AA to retrieve the data from the relevant FIPs. This request contains the details of the data required (such as bank account statements, loan details, etc.). The Data Request comprises the details of the consent and key material ($\mathsf{pk}$) that is to be shared with the FIP to encrypt the data sent in response. The Data Request is digitally signed by the FIU. As shown in Figure 14, FICU nodes perform DKG to generate an ephemeral Curve 25519 Key Pair comprising the FIU public key, ($\mathsf{pk}$), and the FIU distributed private key shares ($\mathsf{sk}_1,\mathsf{sk}_2,\mathsf{sk}_3$). These keys are valid only for one data exchange session. The key shares as equivalent to $\mathsf{sk}$ splitting into secret shares $\mathsf{sk}_1,\mathsf{sk}_2,\mathsf{sk}_3$. The parameters of the secret sharing based DKG are set so that no individual $\mathsf{sk}_i$ reveals _any information at all_ about $k$ itself, and any pair of shares $\mathsf{sk}_i,\mathsf{sk}_j$ fully specify $\mathsf{sk}$.
  This ensures that any party who wishes to reconstruct $\mathsf{sk}$ (and therefore any data it encrypts) will need to convince another party to collude with it.

**Secret sharing** refers to methods for securely distributing a secret among a group of parties. The guarantee is that no individual party holds any intelligible information about the secret, but when a sufficient number of parties combine their 'shares', the secret can be reconstructed. While secret sharing offers secure storage, MPC protocols offer a method to _use_ the underlying secret for a computation without having to reconstruct it—at every intermediate stage of the MPC, all sensitive state remains secret shared.
:::

- **B. Distributed Decryption:** As further adaption, shown in Figure 14, upon transmission of the ciphertext $E$, the FICU nodes engage in an MPC protocol to jointly decrypt $E$ and obtain secret shares of $d$: $d_1,d_2,d_3$ as their respective private outputs.

 <div style="text-align: center;">
    <figure>
        <img src="https://hackmd.io/_uploads/B1rS3Z6yJx.png" alt="Image 124 width="320"/>
        <figcaption>Secret sharing of ciphertext E across multiple nodes </figcaption>
    </figure>
</div>

Although "MPC-Decryption" is depicted as an idealized trusted third party in the above diagram, in reality this functionality is emulated by means of a distributed protocol. In particular, $d_1,d_2,d_3$ are computed and delivered as private outputs to each of the nodes, while leaking no information about $\mathsf{sk}_1,\mathsf{sk}_2,\mathsf{sk}_3$.

- **C. Secure Distributied Multi-Party Computation:** Subsequent to this distributed decryption of $d$, each query upon the dataset is answered in a distributed fashion as well, without physically reconstructing $d$ at any single place. In particular, to compute a function $f(d)$ upon the data, FICU nodes run an MPC protocol (using $d_1,d_2,d_3$ as private inputs) at the end of which they output $f(d)$, while leaking no additional information about $d$ to each other.

Recall the diagram from the previous section that described the flow of information in the Account Aggregator ecosystem. With our new MPC-enabled data processing and governance framework, the FIU's side of the diagram is further decentralized, as depicted below:

 <div style="text-align: center;">
    <figure>
        <img src="https://hackmd.io/_uploads/SyCsysak1e.png" alt="Image 15" width="320"/>
        <figcaption>Computation of f(d) without reconstructing d at a single place </figcaption>
    </figure>
</div>

This system allows for AA, FIU, and Sahamati nodes to securely store the data in a decentralized fashion, and unlock computations on it as relevant and consented to by the user/data principal. A non-compliant node is prevented from accessing any information about the user data if other nodes do not explicitly agree. In combination with a robust consent management framework, the new MPC-enabled design is able to deliver strong cryptographic guarantees for binding computation on user data with consent.

 <div style="text-align: center;">
    <figure>
        <img src="https://hackmd.io/_uploads/H19TGB4AC.png" alt="Image 17" width="320"/>
        <figcaption>Preventing access of input information in case of a rogue data use attempt </figcaption>
    </figure>
</div>

## Integrating with Sahamati

`silence-fiu` is a registered FIU entity with Sahamati Proxy

We create a mock AA, `slience-aa-mock` to simulate all the responses of AA via Simulator

`constants.py` file in util folder needs to upadted with relevant details of the FIU that is testing.

`CLIENT_ID`, `CLIENT_SECRET`, `PUBLIC_KEY`, `PRIVATE_KEY` , `USERNAME` and `PASSWORD` needs to filled with relevant details of a FIU.
