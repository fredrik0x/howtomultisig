import { ChecklistItem } from '@/context/ChecklistContext';

// Version information
export interface ChecklistVersion {
  version: string;          // Semantic version (e.g., "1.0.0")
  releaseDate: string;      // ISO date string
  changes?: string[];       // Optional list of changes in this version
}

// Version and version history
export const version_1_0_0: ChecklistVersion = {
  version: "1.0.0",
  releaseDate: "2025-03-31",
  changes: ["Initial release"]
};

export const version_1_0_1: ChecklistVersion = {
  version: "1.0.1",
  releaseDate: "2025-04-01",
  changes: ["Use a secure hardware wallet: Essential -> Critical",
            "OS Security Updates: Essential -> Critical",
            "Use a dedicated device for signing (Medium, Large treasuries): Recommended -> Critical",
            "Use a separate OS for signing (Small Treasuries): Recommended -> Critical",
            "Signer Role Diversity: Essential -> Recommended",]
};


export const versionHistory: ChecklistVersion[] = [
  version_1_0_1,
  version_1_0_0,  
];

// Export the current version (latest version in the history)
export const currentVersion = versionHistory[0];

// Checklist Sections
export const sections = [
  {
    id: 'safe-multisig',
    title: 'Safe Multisig Setup & Config',
    description: 'Essential practices for secure Safe multisig contract verification, deployment, and configuration.',
    icon: 'ShieldCheck'
  },
  {
    id: 'signers',
    title: 'Signer Security & Ops',
    description: 'Best practices for multisig signers covering key management, identity, availability, and communication.',
    icon: 'UsersRound'
  },
  {
    id: 'verification',
    title: 'Transaction Verification',
    description: 'Critical verification steps for safely reviewing and signing multisig transactions.',
    icon: 'SearchCheck'
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Alerts',
    description: 'Setting up proper monitoring and alerts for multisig activities and configuration changes.',
    icon: 'BellRing'
  },
  {
    id: 'emergency',
    title: 'Emergency Preparedness',
    description: 'Planning and procedures for handling compromised keys or other urgent situations.',
    icon: 'AlertTriangle'
  }
];

// Checklist Items
export const checklistItems: ChecklistItem[] = [
  // --- Safe Multisig Setup & Config Section
  {
    id: 'verify-contract',
    section: 'safe-multisig',
    text: 'Verify deployed Safe contract',
    description: 'Must be verified to ensure it is the correct, official Safe contract.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Verifying the Safe multisig contract after deployment is critical to ensure that it is the genuine Safe contract and not a malicious one designed to steal funds. A compromised frontend during deployment could lead to deploying a malicious contract with hidden backdoors, unexpected initializers, or shadow signers.',
    howToImplement: 'Compare the deployed contract bytecode with the official Safe contract bytecode.\n- Use Etherscan or similar block explorers to view the contract code and verify it matches the official Safe repository version intended.\n- Check the contract creation transaction to verify the initializer parameters used during deployment.\n- Check for any unexpected functions, permissions, or events.\n- Ensure there are no shadow signers added during initialization.\n- Consider using contract analysis tools (e.g., Dedaub, Slither) to decompile and analyze the deployed bytecode.'
  },
  {
    id: 'threshold-2-of-3',
    section: 'safe-multisig',
    text: 'Use minimum 2-of-3 threshold',
    description: 'For smaller treasuries, ensure a minimum 2-of-3 signer threshold.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'A single signer should never have unilateral control. A 2-of-3 threshold ensures that at least two trusted individuals must agree on a transaction, significantly reducing the risk of theft or error compared to a single signer or a 1-of-N setup.',
    howToImplement: 'Configure the Safe multisig threshold during setup or via a governance transaction.\n- Ensure there are at least 3 signers assigned.\n- Set the required confirmations threshold to 2.'
  },
  {
    id: 'threshold-3-of-5',
    section: 'safe-multisig',
    text: 'Use minimum 3-of-5 threshold',
    description: 'For medium treasuries, ensure a minimum 3-of-5 signer threshold.',
    priority: 'critical',
    minimumProfile: 'medium',
    whyImportant: 'As the value secured increases, the threshold should increase to provide greater security against collusion or compromise of multiple signers. A 3-of-5 setup requires a majority consensus among a larger group, making attacks significantly harder.',
    howToImplement: 'Configure the Safe multisig threshold.\n- Ensure there are at least 5 signers assigned.\n- Set the required confirmations threshold to 3.'
  },
  {
    id: 'threshold-4-of-7',
    section: 'safe-multisig',
    text: 'Use minimum 4-of-7 threshold',
    description: 'For large treasuries, ensure a minimum 4-of-7 signer threshold.',
    priority: 'critical',
    minimumProfile: 'large',
    whyImportant: 'For very high-value treasuries, a higher threshold like 4-of-7 provides maximum security against collusion and ensures that a significant majority of signers must approve actions. This level of redundancy protects against multiple simultaneous compromises.',
    howToImplement: 'Configure the Safe multisig threshold.\n- Ensure there are at least 7 signers assigned.\n- Set the required confirmations threshold to 4.'
  },
  {
    id: 'limit-daily-allowance',
    section: 'safe-multisig',
    text: 'Strictly limit Daily Allowance module use',
    description: 'If used, limit to specific needs and reasonable amounts.',
    priority: 'recommended',
    minimumProfile: 'small',
    whyImportant: 'The Daily Allowance module bypasses the standard multisig threshold for smaller, frequent transactions. While convenient, it reduces security. Its use should be minimized and amounts strictly controlled to limit potential losses if the allowance key is compromised.',
    howToImplement: 'Only enable the Daily Allowance module if operationally necessary for frequent, small transactions that cannot wait for the standard signing period.\n- Grant allowance permissions only to addresses with a proven, direct need.\n- Set the allowance amount to the minimum reasonable value required for daily operations.\n- Regularly review the necessity and amount of the allowance.'
  },

  // --- Signers Section ---
  {
    id: 'discreet-signer',
    section: 'signers',
    text: 'Never reveal signer identity publicly',
    description: 'Keep your status as a signer private to reduce personal attack risk.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Publicly revealing your role as a multisig signer makes you a high-value target for virtual attacks (phishing, malware) and physical threats (coercion, theft). Anonymity is a key layer of personal and organizational security.',
    howToImplement: 'Maintain strict operational security (OpSec) regarding your role.\n- Never publicly associate your identity (name, social media) with the multisig address or your signer address.\n- Avoid discussing your signer role in public forums, social media, or insecure channels.\n- Be cautious about who you inform, even within trusted circles.\n- Use privacy tools (VPNs) when interacting with multisig interfaces if appropriate.\n- Be mindful of physical security and potential surveillance risks.'
  },
  {
    id: 'secure-seed-phrase',
    section: 'signers',
    text: 'Secure physical seed phrase backups',
    description: 'Store seed phrase physically, offline, securely, and separately from the hardware wallet.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'The seed phrase is the master key to your funds. Storing it digitally (computer, cloud, password manager) makes it vulnerable to remote hacking, malware, and data breaches. Physical, offline backups are essential for recovery and security.',
    howToImplement: 'Create backups on durable physical media (e.g., paper, metal plates).\n- Never type, photograph, or store the seed phrase digitally.\n- Store backups in multiple, geographically separate, secure locations (e.g., home safe, safe deposit box).\n- Crucially, store backups in a *different physical location* than the hardware wallet itself.\n- Consider splitting the seed phrase across multiple locations using shamir\'s secret sharing scheme.\n- Use tamper-evident bags if appropriate.'
  },
  {
    id: 'secure-hardware-wallet',
    section: 'signers',
    text: 'Use a secure hardware wallet',
    description: 'Use a reputable hardware wallet, stored securely but accessibly.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Hardware wallets keep private keys offline, isolating them from malware and online threats that plague software wallets on internet-connected devices. They provide a secure environment for signing transactions.',
    howToImplement: 'Purchase a hardware wallet directly from the manufacturer or authorized retailer (avoid marketplaces like Amazon/eBay due to tampering risk).\n- Recommended vendors: Ledger, Trezor, GridPlus, Keystone.\n- Verify device authenticity upon receipt.\n- Keep firmware updated.\n- Store the device securely (e.g., locked drawer, safe) when not in use, but ensure it remains reasonably accessible for timely signing when needed.',
    modifiedInVersion: '1.0.1'
  },
  {
    id: 'os-security-updates',
    section: 'signers',
    text: 'Keep OS up-to-date with security patches',
    description: 'Regularly update the OS of the device used for interacting with the multisig.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Operating system vulnerabilities are common attack vectors. Keeping the OS patched minimizes the risk of malware or exploits compromising the device used for creating or signing transactions, even if a hardware wallet is used.',
    howToImplement: 'Enable automatic security updates for your OS (Windows, macOS, Linux).\n- Regularly check for and apply updates, especially before signing sessions.\n- Also keep browser and wallet interface software up-to-date.\n- For dedicated signing devices, ensure updates are applied when the device is brought online.',
    modifiedInVersion: '1.0.1'
  },
  {
    id: 'dedicated-device',
    section: 'signers',
    text: 'Use dedicated, hardened device for signing',
    description: 'Use a dedicated, minimally exposed computer solely for signing.',
    priority: 'critical',
    minimumProfile: 'medium',
    whyImportant: 'A general-purpose computer used for email, browsing, and messaging is constantly exposed to malware and phishing. A dedicated, hardened device dramatically reduces the attack surface for the critical signing process.',
    howToImplement: 'Acquire a separate computer (laptop preferred for portability/isolation).\n- Use it *only* for connecting the hardware wallet and interacting with the Safe interface.\n- Do not use it for email, web browsing, chat, or any other activity.\n- Keep it air-gapped or minimally connected to the network only when needed.\n- Harden the OS (minimal software, firewall, encryption).\n- Procedure: Boot -> Connect -> Verify Tx -> Sign -> Disconnect -> Shutdown.',
    modifiedInVersion: '1.0.1',
  },
  {
    id: 'separate-os',
    section: 'signers',
    text: 'Use separate OS for signing',
    description: 'Run an OS like Ubuntu from a secure USB with persistent storage setup for signing sessions. By enabling persistent storage, you can save your settings and files across sessions.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'A dedicated OS is likely to provide a clean, malware-free environment for each signing session.',
    howToImplement: 'Install onto a high-quality, encrypted USB drive (e.g., Kingston IronKey).\n- Boot the dedicated signing device from this USB drive *only* for signing sessions.\n- Connect to network -> Verify -> Sign -> Shutdown immediately.\n- Keep the USB drive physically secure.',
    modifiedInVersion: '1.0.1',
  },
  {
    id: 'unique-address',
    section: 'signers',
    text: 'Use unique address for each multisig',
    description: 'Generate and use a distinct hardware wallet address for each multisig you are part of.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'Using the same address across multiple multisigs increases the risk of confusion or accidental signing of transactions intended for a different multisig. It also links your activity across different entities.',
    howToImplement: 'Generate a new, unused address from your hardware wallet for each multisig.\n- Utilize HD wallet derivation paths to create separate accounts/addresses.\n- Clearly label each address within your wallet software (e.g., "Multisig A Signer", "Multisig B Signer").\n- Securely document offline which address corresponds to which multisig.'
  },
  {
    id: 'dedicated-address',
    section: 'signers',
    text: 'Use dedicated address solely for multisig',
    description: 'The signer address must only be used for multisig interactions, not DeFi, NFTs, etc.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'Using a signer address for other activities (DeFi, NFTs, airdrops) drastically increases its attack surface. Approving malicious contracts or interacting with compromised dApps could lead to the signer key being compromised, jeopardizing the multisig.',
    howToImplement: 'Strictly reserve the designated signer address for multisig operations only.\n- Do not use this address to interact with any other dApps, sign token approvals, or claim NFTs/airdrops.\n- Keep the address activity minimal and focused solely on Safe multisig signing.\n- Consider using an entirely separate hardware wallet for high-value multisig signing.'
  },
  {
    id: 'secure-communication',
    section: 'signers',
    text: 'Use secure E2EE communication channel',
    description: 'Use Signal (with PIN) or similar E2EE system with disappearing messages for coordination.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'Discussing transactions, coordinating signatures, or handling emergencies requires secure communication. Standard channels (email, SMS, Discord, Telegram default) are vulnerable to interception or impersonation. E2EE ensures confidentiality and integrity.',
    howToImplement: 'Establish a primary communication channel using Signal or a comparable E2EE messenger.\n- All signers must install and configure the app securely (e.g., Signal PIN enabled).\n- Create a dedicated, verified group chat for signers.\n- Verify all participants in the chat are authorized to be there. \n- Verify participant identities using safety numbers or an out-of-band method.\n- Use disappearing messages for sensitive discussions or transaction details (e.g., 1 day timer).\n- Avoid sharing sensitive details over insecure channels.'
  },
  {
    id: 'security-awareness',
    section: 'signers',
    text: 'Maintain high security awareness',
    description: 'Recognize phishing, social engineering, deepfakes, and other sophisticated attack vectors.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'Attackers constantly evolve their methods. Signers are high-value targets and must be vigilant against deception. Technical controls are insufficient without human awareness and skepticism.',
    howToImplement: 'Stay informed about current threats (phishing campaigns, wallet drainers, social engineering tactics).\n- Be inherently skeptical of unsolicited requests or unusual communication, even from known contacts (verify out-of-band).\n- Understand the risk of deepfake audio/video impersonation.\n- Know that malware can manipulate what you see on screen (address poisoning, fake interfaces).\n- Foster a culture where asking clarifying questions and double-checking is encouraged.\n- Participate in security training and awareness programs.'
  },
    {
    id: 'high-value-tx-procedure',
    section: 'signers',
    text: 'Follow enhanced procedure for high-value tx',
    description: 'Use Signal notification, potentially video call with safe word for high-value/risk transactions.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'High-value transactions warrant additional verification steps beyond routine checks to mitigate the risk of sophisticated attacks or internal errors with significant consequences.',
    howToImplement: 'Define thresholds for "high-value" or high-risk transactions.\n- Proposer sends a notification message to the signer group via the secure E2EE channel (e.g., Signal ephemeral chat).\n- For extremely high values or sensitive operations: Coordinate a brief video call with at least 3 signers attending.\n- During the call, verbally verify transaction details and confirm using a pre-shared "safe word" (that has *only* been shared in person and never digitally).'
  },
  {
    id: 'availability-48',
    section: 'signers',
    text: 'Be available to sign within 48 hours',
    description: 'Respond to routine signing requests within a 48-hour timeframe.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'Multisig operations rely on timely responses from multiple signers. Consistent availability ensures routine transactions (e.g., payroll, operational expenses) can be processed without undue delay.',
    howToImplement: 'Commit to checking secure communication channels and responding to signing requests within 48 hours during normal working periods.\n- Keep signing hardware accessible.\n- Set up notifications for the secure communication channel.\n- Plan signing activities considering time zone differences within the group.'
  },
  {
    id: 'notify-unavailability',
    section: 'signers',
    text: 'Notify team of planned unavailability',
    description: 'Inform the coordinator/group in advance if unable to sign for a period.',
    priority: 'essential',
    minimumProfile: 'small',
    whyImportant: 'Unannounced absences can stall transactions if the remaining signers fall below the threshold. Advance notice allows the team to plan operations around absences or potentially expedite transactions before the signer becomes unavailable.',
    howToImplement: 'Provide advance notice (e.g., >72 hours when possible) via the secure channel about planned periods of unavailability (vacation, travel).\n- Specify the dates of unavailability.\n- Check for pending important transactions before leaving.\n- For unexpected unavailability, notify the team as soon as feasible.'
  },
  {
    id: 'signer-role-diversity',
    section: 'signers',
    text: 'Ensure diverse roles/backgrounds of signers',
    description: 'Signers should ideally have different roles within the org and diverse backgrounds.',
    priority: 'essential',
    minimumProfile: 'medium',
    whyImportant: 'Having signers with diverse roles and perspectives helps minimize the risk of collusion. If all signers belong to the same small team or share identical interests, it may be easier for them to conspire against the organization\'s interests.',
    howToImplement: 'Select signers from different departments or functional areas (e.g., finance, engineering, legal, leadership).\n- Ensure signers are highly trusted individuals with proven track records and alignment with the organization\'s goals.\n- Consider background checks where appropriate for the level of trust required.',
    modifiedInVersion: '1.0.1'
  },
  {
    id: 'hw-vendor-diversity',
    section: 'signers',
    text: 'Use diverse hardware wallet vendors',
    description: 'Signers should use a mix of reputable hardware wallet vendors (Ledger, Trezor, Grid+, etc.).',
    priority: 'recommended',
    minimumProfile: 'small',
    whyImportant: 'Relying on a single hardware wallet vendor introduces a single point of failure. A vulnerability discovered in one vendor\'s hardware or software could potentially affect all signers simultaneously if they all use the same brand.',
    howToImplement: 'When onboarding signers, aim for representation from multiple reputable hardware wallet manufacturers.\n- Example mix: Some use Ledger, some Trezor, some GridPlus, etc.\n- This does not mean one signer needs multiple brands, but that the group collectively uses different ones.\n- Document the vendor used by each signer (securely).'
  },
  {
    id: 'signer-geo-diversity',
    section: 'signers',
    text: 'Ensure geographic diversity of signers',
    description: 'Signers should be located in different geographical regions.',
    priority: 'recommended',
    minimumProfile: 'medium',
    whyImportant: 'Concentrating all signers in one location increases risk from localized events like natural disasters, political instability, infrastructure outages, or targeted physical attacks affecting multiple signers simultaneously.',
    howToImplement: 'When selecting signers, consider their primary geographic location.\n- Aim for a distribution across different cities, states, or countries, where practical.\n- Avoid having a majority of signers residing in the same immediate area.'
  },
  {
    id: 'avoid-group-travel',
    section: 'signers',
    text: 'Avoid all signers attending the same event',
    description: 'Key signers (enough to meet threshold) should avoid travelling together or attending the same conference.',
    priority: 'recommended',
    minimumProfile: 'large',
    whyImportant: 'Having multiple signers in the same physical location (especially public events like conferences) increases the risk of coordinated physical attacks, theft, or targeted social engineering attempts against the group.',
    howToImplement: 'Establish a policy or guideline discouraging simultaneous travel or attendance at the same event for a quorum of signers.\n- Coordinate travel plans within the signer group to avoid concentration.\n- If attendance is necessary, implement heightened security measures for devices.'
  },
  {
    id: 'use-safe-word',
    section: 'signers',
    text: 'Establish and use offline safe word',
    description: 'Use a pre-agreed safe word (shared ONLY in person) for extra verification.',
    priority: 'recommended',
    minimumProfile: 'large',
    whyImportant: 'A safe word, shared only physically and never digitally, provides a strong authentication factor against remote impersonation (e.g., deepfakes, compromised accounts) during critical communications like high-value transaction verification.',
    howToImplement: 'Agree on a unique, non-obvious safe word during an in-person meeting of signers.\n- NEVER record the safe word digitally (no email, chat, password managers).\n- Define specific scenarios where the safe word must be used (e.g., emergency calls, high-value transaction video verification).\n- Practice using it securely.'
  },
  {
    id: 'quarterly-rehearsals',
    section: 'signers',
    text: 'Participate in periodic signing rehearsals/exercises',
    description: 'Regularly practice the signing process and simulate emergency scenarios.',
    priority: 'recommended',
    minimumProfile: 'large',
    whyImportant: 'Infrequently used multisigs carry the risk of signers forgetting procedures, losing keys, or encountering software issues unnoticed. Regular rehearsals ensure operational readiness, verify key access, and allow practice for emergency response (tabletop exercises).',
    howToImplement: 'Schedule mandatory rehearsals (e.g., quarterly if tx frequency is low).\n- Perform a full signing workflow with a test transaction (or a low-value real one).\n- Verify hardware wallets, software, and procedures are working.\n- Periodically conduct tabletop exercises simulating scenarios like key compromise, signer unavailable, urgent transaction needed.'
  },
  {
    id: 'use-eip712-hardware-wallet',
    section: 'signers',
    text: 'Use EIP-712 supporting hardware wallet',
    description: 'Prefer newer HW wallets that clearly display EIP-712 structured data.',
    priority: 'recommended',
    minimumProfile: 'small',
    whyImportant: 'EIP-712 provides a standardized way to display complex contract interaction data in a more human-readable format on hardware wallet screens. This makes verifying parameters much easier and safer than trying to interpret raw calldata or relying solely on hashes.',
    howToImplement: 'Use hardware wallet models known to have good EIP-712 support.\n- Ensure the firmware and Ethereum app are up-to-date.\n- During signing, carefully read the structured data fields presented (function name, parameter names and values).\n- Compare these details against the intended transaction and the Safe UI.\n- This complements, but does not replace, hash verification.'
  },

  // --- Verification Steps Section ---
  {
    id: 'check-transaction-intent',
    section: 'verification',
    text: 'Understand transaction purpose and effect',
    description: 'Never sign blindly. Fully understand what the transaction does and why.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Signing a transaction without understanding its function is equivalent to signing a blank check. You might authorize fund transfers to attackers, grant malicious contract permissions, or cause operational failures.',
    howToImplement: 'Review the transaction\'s purpose: What is it trying to achieve?\n- Verify it aligns with team discussions and operational plans.\n- Check the target address, function being called, and parameters.\n- If interacting with a contract, understand its role (e.g., swapping tokens, staking, changing settings).\n- If anything is unclear or suspicious, *do not sign*. Ask for clarification via the secure channel.'
  },
  {
    id: 'verify-transaction-origin',
    section: 'verification',
    text: 'Verify transaction proposal origin',
    description: 'Confirm the transaction was intentionally proposed by the expected signer/initiator.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'An attacker or compromised signer might propose malicious transactions. Verifying the proposal\'s legitimacy with the initiator (out-of-band) prevents signing fraudulent or coerced transactions.',
    howToImplement: 'Use the secure E2EE channel (e.g., Signal) to confirm with the proposer.\n- Ask: "Did you just propose transaction X (brief description)?"\n- Do not rely solely on the UI indication of the proposer.\n- Be wary of urgent requests or pressure to sign quickly.\n- For high-value transactions, stricter verification (video call, safe word) may apply.'
  },
  {
    id: 'simulate-transaction',
    section: 'verification',
    text: 'Simulate transaction',
    description: 'Use simulation tools to preview the outcome.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Simulations execute the transaction in a virtual environment, revealing the exact state changes (balances, storage), events emitted, and whether it reverts. This helps catch errors, unexpected side effects, or hidden malicious logic before signing.',
    howToImplement: 'Use a simulation platform like Tenderly.\n- Input the proposed transaction details (from, to, value, data, nonce, etc.).\n- Run the simulation against the current or a recent block.\n- Analyze the results: Did it succeed? Are the balance changes correct? Are expected events emitted? Are there unexpected state changes?\n- Be aware that simulations may not catch all malicious behavior (e.g., time/block-dependent logic, off-chain oracle manipulation).'
  },
  {
    id: 'decode-verify-calldata',
    section: 'verification',
    text: 'Decode and verify transaction calldata',
    description: 'For contract interactions, decode function calls and parameters to ensure they are correct.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Raw calldata is unreadable. Malicious actions (e.g., setting approvals, transferring ownership) can be hidden within complex calldata. Decoding reveals the actual function being called and the parameters being used.',
    howToImplement: 'Use the Safe UI and Etherscan\'s calldata decoder to interpret the transaction data.\n- Verify the target contract address is correct.\n- Verify the function name being called is expected (e.g., `transfer`, `approve`, `execute`).\n- Meticulously check all parameters: recipient addresses, amounts, token IDs, settings being changed.\n- Pay extreme attention to `approve` calls (ensure amounts are specific, not infinite) and administrative functions.'
  },
  {
    id: 'verify-to-address',
    section: 'verification',
    text: 'Verify To address (recipient/contract)',
    description: 'Meticulously check the destination address against a trusted source.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Sending funds or interacting with the wrong address is often irreversible. Attackers use "address poisoning" or typosquatting to trick users into sending assets to malicious addresses. Verifying the *entire* address is crucial.',
    howToImplement: 'Compare the full "To" address shown in the Safe UI and on your hardware wallet.\n- Cross-reference the address with an official source (project website, documentation, previously verified contact list).\n- Do not trust addresses received via insecure channels (email, Telegram DMs).\n- Be extra careful with copy-pasting; verify the pasted address character-by-character if possible, or at least first/last few and checksum.'
  },
  {
    id: 'verify-value',
    section: 'verification',
    text: 'Verify Value (ETH/native token amount)',
    description: 'Check that the amount of native currency being sent is correct.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Incorrectly entering the native token value (e.g., ETH) can lead to sending far more or less than intended. This is especially critical for direct transfers but also applies to contract interactions that require payment.',
    howToImplement: 'Confirm the value field matches the intended amount.\n- Pay close attention to decimal places and units (ETH vs Gwei vs Wei).\n- For contract interactions that shouldn\'t send native tokens, verify the value is 0.\n- Double-check large transfers.\n- Confirm the amount matches what was agreed upon or requested.'
  },
  {
    id: 'verify-call-type',
    section: 'verification',
    text: 'Verify Operation Type (Call vs DelegateCall)',
    description: 'Ensure Operation is "Call (0)". Treat "DelegateCall (1)" with extreme suspicion.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: '`DelegateCall` allows another contract to execute code *within the context* of the Safe, inheriting its permissions and storage. A malicious `DelegateCall` can grant full control or drain all assets. It should *only* be used with highly trusted, audited contracts (like official Safe modules or approved multicall contracts).',
    howToImplement: 'Check the "Operation" field in the Safe UI and on your hardware wallet.\n- It should almost always be "Call (0)".\n- If "DelegateCall (1)" is proposed: STOP. This requires expert review.\n- Verify if the target contract is on an *explicitly pre-approved* list of trusted delegatecall targets (e.g., official Safe modules, known multicall implementations). See Safes trusted list.\n- Understand that simulations might not catch time-locked or condition-based malicious behavior in delegatecalled contracts. Deep manual review is essential.\n- If unsure, reject the transaction.'
  },
  {
    id: 'check-delegatecall-trusted',
    section: 'verification',
    text: 'Verify DelegateCall target against trusted list',
    description: 'If Operation is DelegateCall(1), verify the target contract is explicitly known and trusted.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'DelegateCall is inherently dangerous. Limiting its use to only pre-vetted, known-good contracts (like official Safe modules or specific audited infrastructure) is crucial to prevent catastrophic exploits.',
    howToImplement: 'If the Operation type is 1 (DelegateCall):\n- Identify the target contract address.\n- Check this address against your organization\'s maintained list of approved/trusted DelegateCall targets.\n- Consult the official Safe list of trusted delegate calls for known modules.\n- If the target is NOT on a trusted list, the transaction should be rejected unless thoroughly audited and approved by security experts.\n- Remember: Untrusted DelegateCall is almost never legitimate.'
  },
  {
    id: 'verify-nonce',
    section: 'verification',
    text: 'Verify Transaction Nonce',
    description: 'Ensure the nonce is correct (usually sequential). Avoid signing future-nonce transactions unnecessarily.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'The nonce prevents replay attacks and ensures transaction order. Signing a transaction with a much higher nonce than the current one means that signature remains valid (and potentially executable by anyone) until the Safe\'s nonce naturally increments to that number, creating a lingering risk.',
    howToImplement: 'Check the current nonce of the Safe on a block explorer.\n- Verify the transaction nonce is the current nonce + 1 (or the next available if multiple are queued).\n- Be suspicious of unexpectedly high nonces.\n- If queuing multiple transactions, ensure their nonces are sequential (N, N+1, N+2...). Reject transactions with large, unexplained nonce gaps.'
  },
  {
    id: 'verify-gas-params',
    section: 'verification',
    text: 'Verify gas refund parameters are zero',
    description: 'Ensure safeTxGas, baseGas, gasPrice, gasToken, refundReceiver are 0 unless specifically required and understood.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Attackers can manipulate these gas parameters to drain funds from the Safe. Setting a non-zero `gasToken` with a high `gasPrice` and a malicious `refundReceiver` allows the transaction executor to receive refunds in valuable tokens, potentially stealing all gas token funds from the Safe.',
    howToImplement: 'In the transaction details (often under advanced options or when using tools), verify:\n- `safeTxGas` = 0\n- `baseGas` = 0\n- `gasPrice` = 0\n- `gasToken` = 0x00...00 (zero address)\n- `refundReceiver` = 0x00...00 (zero address)\n- Only deviate from zero if using a gas abstraction mechanism (like paying fees in ERC20s via a relay) that is fully understood and trusted.\n- Verify these on the hardware wallet display if possible.'
  },
  {
    id: 'generate-safe-hashes',
    section: 'verification',
    text: 'Generate Safe Transaction Hash independently',
    description: 'Use offline tools (e.g., safe-tx-hash) to generate and verify the transaction hash.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'The Safe UI or other interfaces could be compromised to show misleading information while generating a hash for a malicious transaction. Independently generating the hash from the raw parameters provides a crucial cross-check.',
    howToImplement: 'Use a trusted, ideally offline tool like `safe-tx-hashes-util` (or similar).\n- For extra security, verify a second time using a tool like `Safe Utils` by OpenZeppelin.\n- Input the exact transaction parameters (to, value, data, operation, nonce, etc.).\n- Generate the `safeTxHash`, `domainHash`, and `messageHash`.\n- Carefully note any warnings produced by the tool.\n- Compare these generated hashes with those shown in the Safe UI and on the hardware wallet.\n- All hashes MUST match exactly. Any discrepancy means potential tampering - DO NOT SIGN.'
  },
  {
    id: 'verify-ui-details',
    section: 'verification',
    text: 'Verify details match between Safe UI and Wallet UI',
    description: 'Cross-check all fields (nonce, gas, addresses, data) between Safe UI and hardware wallet screen.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Discrepancies between the Safe web interface and what your hardware wallet shows indicate a potential issue, possibly a compromised web application or wallet connection. The hardware wallet screen is the ultimate source of truth.',
    howToImplement: 'Carefully compare every detail presented in the Safe UI for the transaction against the details shown step-by-step on your hardware wallet screen during signing.\n- Check: Nonce, Operation, To Address, Value, Calldata/Function/Parameters, Gas settings, Hashes.\n- If any detail differs, reject the transaction and investigate the discrepancy.'
  },
  {
    id: 'verify-hashes-on-hardware',
    section: 'verification',
    text: 'Verify Domain and Message Hash on hardware wallet',
    description: 'Confirm Domain Hash and Message Hash on hardware wallet match independently generated ones.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'The hardware wallet display is the most trustworthy place to verify what you are actually signing. Confirming the cryptographic hashes (Domain and Message/SafeTxHash) shown on device match independently generated ones provides strong assurance against UI or connection tampering.',
    howToImplement: 'Generate hashes independently using `safe-tx-hashes-util` or similar.\n- During the signing flow on your hardware wallet, carefully review:\n  - The Domain Separator Hash (identifies the Safe instance and chain).\n  - The Message Hash (often the EIP-712 `safeTxHash`).\n- Compare these character-by-character against the independently generated hashes.\n- They MUST match exactly. If not, reject.'
  },
  {
    id: 'no-blind-signing',
    section: 'verification',
    text: 'Do not blind sign on hardware wallet',
    description: 'Ensure hardware wallet displays transaction details (or hashes); never sign if it says "Data Unavailable" or similar.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'Blind signing means approving a transaction without the hardware wallet being able to display what you are signing. This completely bypasses the security benefit of the hardware wallet, allowing a compromised computer to trick you into signing anything.',
    howToImplement: 'Ensure "blind signing" or "contract data" is enabled in your hardware wallet settings (e.g., Ledger settings for the Ethereum app).\n- During signing, carefully review all details shown on the hardware wallet screen (address, amount, nonce, function data if available, hashes).\n- If the hardware wallet cannot parse the transaction and asks for blind signing or shows "Data Unavailable", *reject the transaction* unless you are an expert who fully understands the risks and the raw data.\n- Use hardware wallets that support EIP-712 for clearer data display.'
  },
  {
    id: 'perform-test-transaction',
    section: 'verification',
    text: 'Perform small test transaction first (if new)',
    description: 'When interacting with a new contract or function, send a small test tx first if possible.',
    priority: 'recommended',
    minimumProfile: 'small',
    whyImportant: 'Before committing significant funds or performing critical operations with an unfamiliar contract or function, a small test transaction can confirm the interaction works as expected and doesn\'t have unexpected side effects, reducing the risk of costly errors.',
    howToImplement: 'Identify situations involving new contracts, new functions on known contracts, or complex interactions.\n- If feasible, construct an identical transaction but with a minimal amount (e.g., $1 worth of tokens, smallest possible parameter value).\n- Propose, sign, and execute the test transaction.\n- Verify the on-chain result matches expectations.\n- If successful, proceed with the full intended transaction.'
  },
  // --- Monitoring & Alerts Section ---
  {
    id: 'config-change-alerts',
    section: 'monitoring',
    text: 'Set critical alerts for Safe config changes',
    description: 'Monitor owner changes, threshold changes, module enable/disable, guard changes.',
    priority: 'critical',
    minimumProfile: 'medium',
    whyImportant: 'Changes to the Safe\'s configuration (owners, threshold, modules, guards) are extremely sensitive security events. Immediate notification is crucial to detect and respond to unauthorized modifications that could compromise the Safe.',
    howToImplement: 'Use monitoring services or custom scripts.\n- Configure alerts specifically for events like `AddedOwner`, `RemovedOwner`, `ChangedThreshold`, `EnabledModule`, `DisabledModule`, `ChangedGuard`, etc.\n- Set these as highest priority (P0/Critical) alerts.\n- Route notifications immediately to the secure E2EE channel and potentially SMS/phone for key personnel.\n- Have a predefined incident response plan for unauthorized config changes.'
  },
  {
    id: 'setup-monitoring',
    section: 'monitoring',
    text: 'Set up real-time multisig monitoring',
    description: 'Use internal/external tools for on-chain activity monitoring with alerts to secure channels.',
    priority: 'essential',
    minimumProfile: 'medium',
    whyImportant: 'Continuous monitoring provides visibility into all Safe activities (proposals, confirmations, executions, failures). Alerts enable rapid detection of suspicious or unauthorized actions, minimizing potential damage.',
    howToImplement: 'Choose a monitoring solution (e.g., Tenderly Web3 Actions, Defender Sentinels, custom scripts using RPC nodes).\n- Monitor key Safe events: `SignMsg` (confirmations), `ApproveHash` (owner approvals), `ExecutionSuccess`, `ExecutionFailure`.\n- Configure alerts to be sent to a dedicated, secure channel (Signal group, private Slack/Discord with webhook).\n- Consider adding SMS or email alerts as secondary channels for critical events.\n- Ensure multiple team members receive alerts (avoid single point of failure).\n- Define alert priorities (e.g., Info for confirmations, High for failures, Critical for config changes).'
  },
  {
    id: 'execution-alerts',
    section: 'monitoring',
    text: 'Set alerts for transaction execution (success/fail)',
    description: 'Receive notifications for both successful and failed transaction executions.',
    priority: 'essential',
    minimumProfile: 'medium',
    whyImportant: 'Execution alerts provide confirmation that intended actions occurred and serve as an audit log. Failure alerts are equally important as they can indicate configuration issues, network problems, or potentially malicious transactions being blocked.',
    howToImplement: 'Configure monitoring for `ExecutionSuccess` and `ExecutionFailure` events on the Safe contract.\n- Include key details in alerts: transaction hash, nonce, success/failure status, executor address.\n- Set priority appropriately (e.g., Info/Low for success, Medium/High for failure).\n- Route to the standard monitoring channel.\n- Regularly review execution history, especially failures.'
  },
   {
    id: 'maintain-audit-trail',
    section: 'monitoring',
    text: 'Maintain off-chain audit trail',
    description: 'Store additional details (purpose, approval context) off-chain for each transaction.',
    priority: 'recommended',
    minimumProfile: 'medium',
    whyImportant: 'While blockchain provides an immutable ledger, it lacks context. An off-chain log explaining *why* each transaction was made, who requested/approved it, and linking relevant discussions provides crucial auditability, accountability, and historical context.',
    howToImplement: 'Establish a system (e.g., internal wiki or spreadsheet) for logging multisig transactions.\n- For each proposed/executed transaction, record: Tx Hash, Date, Proposer, Signers and Purpose/Justification.\n- Ensure this log is securely stored and backed up.\n- Make log entry a required step in the transaction workflow.'
  },
  {
    id: 'monitor-signer-activity',
    section: 'monitoring',
    text: 'Monitor non-multisig activity by signer addresses',
    description: 'Set up monitoring for activity on the signers\' dedicated addresses.',
    priority: 'recommended',
    minimumProfile: 'medium',
    whyImportant: 'Even if dedicated, a signer address might accidentally interact with a malicious contract or receive suspicious tokens. Monitoring these addresses for unexpected approvals, interactions, or incoming scam tokens can provide early warning of potential compromise.',
    howToImplement: 'Use monitoring tools to watch the signer addresses (not just the Safe address).\n- Set alerts for all types of transactions excluding the multisig as the address should only be used to interact with the specific multisig.'
  },
  {
    id: 'proposal-alerts',
    section: 'monitoring',
    text: 'Set alerts for new transaction proposals',
    description: 'Receive medium priority alerts when new transactions are proposed.',
    priority: 'recommended',
    minimumProfile: 'large',
    whyImportant: 'Alerting on proposals gives signers immediate visibility into pending actions, allowing them to review early. It can also help detect unauthorized proposal attempts if the proposer address is unexpected.',
    howToImplement: 'Use monitoring services or custom scripts to monitor for new pending transactions via the Safe API.'
  },

  // --- Emergency Preparedness Section ---
  {
    id: 'notify-key-compromise',
    section: 'emergency',
    text: 'Immediately notify team of key compromise',
    description: 'Notify the coordinator immediately via secure channel if key is lost, stolen, or potentially leaked.',
    priority: 'critical',
    minimumProfile: 'small',
    whyImportant: 'A compromised key is an active threat. Immediate notification allows the team to initiate the emergency plan, rotate the compromised key out, and prevent unauthorized transactions before an attacker can drain funds.',
    howToImplement: 'Follow the established emergency communication protocol.\n- Contact the designated coordinator(s) immediately using the secure, pre-agreed channel (e.g., Signal).\n- Clearly state the key is compromised or suspected to be.\n- Provide relevant details (when, how, if known) without compromising further security.\n- Do not use the compromised key again.\n- Cooperate fully with the key rotation process.\n- Do not delay notification due to uncertainty or embarrassment.'
  },
  {
    id: 'emergency-plan',
    section: 'emergency',
    text: 'Establish documented emergency plan',
    description: 'Have a clear plan for responding to key compromises or other critical incidents.',
    priority: 'essential',
    minimumProfile: 'medium',
    whyImportant: 'In a crisis, clear procedures and roles are vital. A pre-defined plan ensures a swift, coordinated response to contain threats, rotate keys, and protect assets, minimizing panic and costly mistakes.',
    howToImplement: 'Document an emergency response plan covering:\n- Coordinator Role: Designate primary/backup coordinators responsible for initiating the plan.\n- Communication: Define secure emergency channels (primary/backup).\n- Key Compromise: Steps to quickly assemble remaining signers, propose/execute key rotation tx.\n- Signer List Access: Securely store signer contact details (Signal, phone) behind a "break-the-glass" mechanism, accessible only by coordinators in emergencies.\n- Practice: Periodically review and rehearse the plan (tabletop exercises).'
  },
  {
    id: 'secure-signer-list',
    section: 'emergency',
    text: 'Securely store signer contact list ("Break-the-glass")',
    description: 'Protect the list of signers and their emergency contact info, accessible only in emergencies.',
    priority: 'essential',
    minimumProfile: 'medium',
    whyImportant: 'While signer identities should be private day-to-day, coordinators need immediate access to contact details (Signal, phone) during an emergency. Protecting this list prevents leaking signer info while ensuring reachability when critical.',
    howToImplement: 'Compile a list including each signer\'s name (or pseudonym), secure contact (Signal), and backup contact (phone number).\n- Encrypt this list using strong encryption (e.g., PGP or a secure vault).\n- Store the encrypted list securely (e.g., secure cloud storage, offline hardware).\n- Implement a "break-the-glass" procedure: Access requires approval from multiple coordinators or designated individuals, and access attempts are logged.\n- Ensure designated coordinators have the necessary keys/passwords to decrypt the list in an emergency.\n- Regularly verify contact details are up-to-date.'
  },
  {
    id: 'availability-24-emergency',
    section: 'emergency',
    text: 'Be available to sign within 24 hours (emergency)',
    description: 'Respond to emergency signing requests within a 24-hour timeframe.',
    priority: 'essential',
    minimumProfile: 'medium',
    whyImportant: 'Emergencies (e.g., key compromise, critical vulnerability response) require rapid action. Delayed responses can lead to significant financial loss or operational failure.',
    howToImplement: 'Commit to prioritizing and responding to clearly marked emergency requests within 24 hours.\n- Ensure emergency contact methods are up-to-date.\n- Have backup access to signing hardware if possible.\n- Understand the defined emergency procedures and communication protocols.'
  },
];

export const resources = [
  {
    title: 'Basic Transaction Checks',
    url: 'https://help.safe.global/en/articles/276343-how-to-perform-basic-transactions-checks-on-safe-wallet'
  },
  {
    title: 'Hardware Wallet Verification',
    url: 'https://help.safe.global/en/articles/276344-how-to-verify-safe-wallet-transactions-on-a-hardware-wallet'
  },
  {
    title: 'Safe Transaction Hash Utility',
    url: 'https://github.com/pcaversaccio/safe-tx-hashes-util'
  }
];
