import type { DimensionLabel, Lang } from '../types'

const DIMENSION_LABELS_FR: DimensionLabel[] = [
  { key: 'source', title: 'SOURCE', question: "C'est qui le chef ?" },
  { key: 'evidence', title: 'EVIDENCE', question: 'Y a-t-il des preuves solides ?' },
  { key: 'intent', title: 'INTENT', question: 'Que cherche ce contenu ?' },
  { key: 'transmission', title: 'TRANSMISSION', question: 'Que normalise ce partage ?' },
  { key: 'impact', title: 'IMPACT', question: 'Quel effet sur la soci├®t├® ?' },
]

const DIMENSION_LABELS_EN: DimensionLabel[] = [
  { key: 'source', title: 'SOURCE', question: 'Who is behind this?' },
  { key: 'evidence', title: 'EVIDENCE', question: 'Is there solid proof?' },
  { key: 'intent', title: 'INTENT', question: 'What is this content trying to do?' },
  { key: 'transmission', title: 'TRANSMISSION', question: 'What does sharing this normalize?' },
  { key: 'impact', title: 'IMPACT', question: 'What effect on society?' },
]

/** Labels i18n des 5 dimensions (sans donn├®es IA ÔÇö celles-ci viennent du backend) */
export function getDimensionLabels(lang: Lang): DimensionLabel[] {
  if (lang === 'en') return DIMENSION_LABELS_EN
  return DIMENSION_LABELS_FR
}

export const ANALYSIS_STEPS: Record<Lang, readonly string[]> = {
  fr: [
    'Observer la source et le domaine',
    'Chercher des preuves disponibles',
    'Rep├®rer les indices techniques',
    'Pr├®parer la co-analyse guid├®e',
  ],
  en: [
    'Observe the source and domain',
    'Search available evidence',
    'Spot technical signals',
    'Prepare guided co-analysis',
  ],
  ln: [
    'Observer la source et le domaine',
    'Chercher des preuves disponibles',
    'Rep├®rer les indices techniques',
    'Pr├®parer la co-analyse guid├®e',
  ],
  sw: [
    'Observe the source and domain',
    'Search available evidence',
    'Spot technical signals',
    'Prepare guided co-analysis',
  ],
}

type Copy = {
  brand: string
  tagline: string
  landingHeadline: string
  landingLead: string
  landingCta: string
  moduleLabel: string
  learnLabel: string
  railLabels: string[]
  learnGoals: [string, string, string, string, string]
  selectedImageAlt: string
  placeholder: string
  launch: string
  footer: string
  depositTitle: string
  analysisRunningTitle: string
  analysisRunningHint: string
  analysisStep: (current: number, total: number) => string
  coAnalysisTitle: string
  coAnalysisHint: (answered: number, total: number) => string
  why: string
  evidenceLabel: string
  yourDecision: string
  confirm: string
  modify: string
  modifyOpinionLabel: string
  modifyOpinionPlaceholder: string
  continue: string
  autoSuggestionLabel: string
  autoSuggestionText: (suggestion: string) => string
  thousandTestLabel: string
  reflectionTitle: string
  reflectionHint: string
  seeVerdict: string
  verdictTitle: string
  verdictLabel: string
  riskConfidenceLabel: string
  reflectionCardTitle: string
  takeawayLabel: string
  choiceCounts: (confirmed: number, modified: number) => string
  deleteContent: string
  shareReflection: string
  verifyPesacheck: string
  recommendationLabel: string
  dimensionsSummaryLabel: string
  launching: string
  shareCopied: string
  continueWithoutAi: string
  newModule: string
  offline: string
  offlineCompass: string
  degradedBanner: string
  emptyDimensionsTitle: string
  emptyDimensionsHint: string
  addImage: string
  removeImage: string
  confidence: (n: number) => string
  languageLabel: string
}

export const COPY: Record<Lang, Copy> = {
  fr: {
    brand: 'Media Compass',
    tagline: 'Apprendre ├á penser avant de partager',
    landingHeadline: 'Apprendre ├á orienter ton jugement avant de partager',
    landingLead:
      'Media Compass tÔÇÖentra├«ne ├á lire un contenu, observer des indices, puis d├®cider ÔÇö sans laisser lÔÇÖoutil penser ├á ta place.',
    landingCta: 'Entrer dans le module',
    moduleLabel: 'Module de citoyennet├® num├®rique',
    learnLabel: 'Objectif dÔÇÖapprentissage',
    railLabels: ['Collecte', 'Diagnostic', '├ëvaluation', 'R├®flexion', 'Synth├¿se'],
    learnGoals: [
      'D├®poser un contenu r├®el et comprendre ce quÔÇÖon va examiner.',
      'Observer avant de juger : rep├®rer indices et m├®thodes de v├®rification.',
      'Comparer la proposition du syst├¿me ├á ton jugement critique.',
      'Formuler lÔÇÖimpact social dÔÇÖun partage collectif.',
      'Retenir un bilan clair et une d├®cision responsable.',
    ],
    selectedImageAlt: 'Capture s├®lectionn├®e',
    placeholder:
      'Colle un lien, un texte ou une capture WhatsApp fournie par ton enseignantÔÇª',
    launch: 'Commencer le module',
    footer: 'Cadre p├®dagogique Transmission HumaineÔäó ┬À Media Compass',
    depositTitle: 'Apporter un contenu ├á ├®tudier',
    analysisRunningTitle: 'Observer avant de juger',
    analysisRunningHint:
      'Chaque ├®tape est un objectif dÔÇÖobservation. Prends le temps de suivre la m├®thode.',
    analysisStep: (current, total) => `Objectif ${current} / ${total}`,
    coAnalysisTitle: 'Co-analyser les 5 dimensions',
    coAnalysisHint: (answered, total) =>
      `Le├ºons valid├®es ┬À ${answered}/${total} ÔÇö le syst├¿me propose, tu d├®cides`,
    why: 'Voir les indices',
    evidenceLabel: 'Indices & preuves',
    yourDecision: 'Ta d├®cision dÔÇÖapprenant',
    confirm: 'Je confirme la proposition',
    modify: 'Je nuance / je corrige',
    modifyOpinionLabel: 'Ton avis',
    modifyOpinionPlaceholder: 'Explique en une phrase pourquoi tu nuancesÔÇª',
    continue: 'Passer ├á la r├®flexion',
    autoSuggestionLabel: 'Proposition du syst├¿me',
    autoSuggestionText: (suggestion) =>
      `Proposition : ${suggestion}. ├Ç toi de valider ou de nuancer.`,
    thousandTestLabel: 'Carnet de r├®flexion',
    reflectionTitle:
      'Si 10 000 jeunes en RDC partagent ce contenu maintenant, quÔÇÖapprend la soci├®t├® ?',
    reflectionHint: '├ëcris une phrase claire. CÔÇÖest ton apprentissage, pas une case ├á cocher.',
    seeVerdict: 'Voir mon bilan',
    verdictTitle: 'Bilan du module',
    verdictLabel: 'Prudence recommand├®e',
    riskConfidenceLabel: 'Niveau de vigilance acquis',
    reflectionCardTitle: 'Ce que tu retiens',
    takeawayLabel: 'Synth├¿se de ton parcours',
    choiceCounts: (confirmed, modified) =>
      `${confirmed} propositions confirm├®es ┬À ${modified} avis nuanc├®s`,
    deleteContent: 'Supprimer le contenu',
    shareReflection: 'Partager ma r├®flexion',
    verifyPesacheck: 'V├®rifier sur PesaCheck',
    recommendationLabel: 'Recommandation',
    dimensionsSummaryLabel: 'Les 5 dimensions',
    launching: 'Analyse en coursÔÇª',
    shareCopied: 'R├®flexion copi├®e',
    continueWithoutAi: 'Continuer sans IA',
    newModule: 'Nouveau module',
    offline:
      'Connexion limit├®e : tu peux poursuivre lÔÇÖanalyse manuelle et continuer dÔÇÖapprendre.',
    offlineCompass:
      'LÔÇÖIA est endormie ├á cause de la connexion, mais ta boussole int├®rieure peut continuer.',
    degradedBanner:
      'Analyse technique limit├®e ÔÇö certains services ├®taient indisponibles. LÔÇÖIA a travaill├® avec moins de preuves.',
    emptyDimensionsTitle: 'Aucune analyse disponible',
    emptyDimensionsHint: 'Relance une v├®rification depuis lÔÇÖ├®cran pr├®c├®dent.',
    addImage: 'Joindre une capture',
    removeImage: 'Retirer lÔÇÖimage',
    confidence: (n) => `Indice de confiance ${Math.round(n * 100)}%`,
    languageLabel: 'Langue',
  },
  en: {
    brand: 'Media Compass',
    tagline: 'Learn to think before you share',
    landingHeadline: 'Learn to orient your judgment before you share',
    landingLead:
      'Media Compass trains you to read content, observe signals, then decide ÔÇö without letting the tool think for you.',
    landingCta: 'Enter the module',
    moduleLabel: 'Digital citizenship module',
    learnLabel: 'Learning goal',
    railLabels: ['Collect', 'Diagnose', 'Evaluate', 'Reflect', 'Summary'],
    learnGoals: [
      'Submit real content and understand what you will examine.',
      'Observe before judging: spot signals and verification methods.',
      'Compare the system proposal with your critical judgment.',
      'Articulate the social impact of collective sharing.',
      'Leave with a clear takeaway and a responsible decision.',
    ],
    selectedImageAlt: 'Selected screenshot',
    placeholder:
      'Paste a link, text, or WhatsApp screenshot shared by your teacherÔÇª',
    launch: 'Start the module',
    footer: 'Human TransmissionÔäó learning framework ┬À Media Compass',
    depositTitle: 'Bring content to study',
    analysisRunningTitle: 'Observe before you judge',
    analysisRunningHint:
      'Each step is an observation goal. Follow the method carefully.',
    analysisStep: (current, total) => `Goal ${current} / ${total}`,
    coAnalysisTitle: 'Co-analyze the 5 dimensions',
    coAnalysisHint: (answered, total) =>
      `Lessons completed ┬À ${answered}/${total} ÔÇö the system proposes, you decide`,
    why: 'See the evidence',
    evidenceLabel: 'Signals & evidence',
    yourDecision: 'Your learner decision',
    confirm: 'I confirm the proposal',
    modify: 'I nuance / correct it',
    modifyOpinionLabel: 'Your view',
    modifyOpinionPlaceholder: 'Explain in one sentence why you nuanceÔÇª',
    continue: 'Continue to reflection',
    autoSuggestionLabel: 'System proposal',
    autoSuggestionText: (suggestion) =>
      `Proposal: ${suggestion}. Confirm it or add nuance.`,
    thousandTestLabel: 'Reflection journal',
    reflectionTitle:
      'If 10,000 young people in the DRC share this content now, what does society learn?',
    reflectionHint: 'Write one clear sentence. This is learning, not a checkbox.',
    seeVerdict: 'See my review',
    verdictTitle: 'Module review',
    verdictLabel: 'Caution recommended',
    riskConfidenceLabel: 'Vigilance level gained',
    reflectionCardTitle: 'What you take away',
    takeawayLabel: 'Path summary',
    choiceCounts: (confirmed, modified) =>
      `${confirmed} confirmed ┬À ${modified} nuanced`,
    deleteContent: 'Delete this content',
    shareReflection: 'Share my reflection',
    verifyPesacheck: 'Verify on PesaCheck',
    recommendationLabel: 'Recommendation',
    dimensionsSummaryLabel: 'The 5 dimensions',
    launching: 'Analysis in progressÔÇª',
    shareCopied: 'Reflection copied',
    continueWithoutAi: 'Continue without AI',
    newModule: 'New module',
    offline:
      'Limited connection: you can continue manual analysis and keep learning.',
    offlineCompass:
      'AI is asleep due to the connection, but your inner compass can continue.',
    degradedBanner:
      'Limited technical analysis ÔÇö some services were unavailable. The AI worked with fewer signals.',
    emptyDimensionsTitle: 'No analysis available',
    emptyDimensionsHint: 'Start a new check from the previous screen.',
    addImage: 'Attach a screenshot',
    removeImage: 'Remove image',
    confidence: (n) => `Confidence index ${Math.round(n * 100)}%`,
    languageLabel: 'Language',
  },
  ln: {
    brand: 'Media Compass',
    tagline: 'Koyekola kanisa liboso ya kokabola',
    landingHeadline: 'Koyekola kozwa jugement liboso ya kokabola',
    landingLead:
      'Media Compass epesa nzela ya kot├ínga contenu, kotala ba indices, mpe kozwa d├®cision ÔÇö outil ekosala te na esika na yo.',
    landingCta: 'Kokota na module',
    moduleLabel: 'Module ya citoyennet├® num├®rique',
    learnLabel: 'Objectif ya koyekola',
    railLabels: ['Kobunda', 'Diagnostic', '├ëvaluation', 'R├®flexion', 'Synth├¿se'],
    learnGoals: [
      'Kotya contenu mpe koyeba oyo tokotala.',
      'Kotala liboso ya kozwa d├®cision.',
      'Kokanisa proposition ya syst├¿me na jugement na yo.',
      'Koloba impact ya soci├®t├®.',
      'Kobanga bilan clair mpe d├®cision responsable.',
    ],
    selectedImageAlt: 'Foto oyo oponi',
    placeholder: 'Tia lien, texte to photo ya WhatsAppÔÇª',
    launch: 'Bandisa module',
    footer: 'Cadre Transmission HumaineÔäó ┬À Media Compass',
    depositTitle: 'Kotya contenu ya koyekola',
    analysisRunningTitle: 'Kotala liboso ya kozwa d├®cision',
    analysisRunningHint: 'Etape nyonso ezali objectif ya observation.',
    analysisStep: (current, total) => `Objectif ${current} / ${total}`,
    coAnalysisTitle: 'Co-analyser ba dimensions 5',
    coAnalysisHint: (answered, total) =>
      `Le├ºons ┬À ${answered}/${total} ÔÇö syst├¿me epesa, yo ozwa d├®cision`,
    why: 'Tala ba indices',
    evidenceLabel: 'Indices & preuves',
    yourDecision: 'D├®cision na yo',
    confirm: 'Nazui proposition',
    modify: 'Nabongoli / nanuance',
    modifyOpinionLabel: 'Opinion na yo',
    modifyOpinionPlaceholder: 'Lobela mwa sentence mpo nini onuanceÔÇª',
    continue: 'Kokende na r├®flexion',
    autoSuggestionLabel: 'Proposition ya syst├¿me',
    autoSuggestionText: (suggestion) =>
      `Proposition: ${suggestion}. Confirme to nuance.`,
    thousandTestLabel: 'Carnet ya r├®flexion',
    reflectionTitle:
      'Soki bilenge 10 000 ya RDC bakabola yango lelo, soci├®t├® ekoyekola nini ?',
    reflectionHint: 'Lokasa moko ya solo. Yango ezali boyekoli.',
    seeVerdict: 'Tala bilan na ngai',
    verdictTitle: 'Bilan ya module',
    verdictLabel: 'Tika prudance',
    riskConfidenceLabel: 'Niveau ya vigilance',
    reflectionCardTitle: 'Oyo ozwaki',
    takeawayLabel: 'Synth├¿se ya parcours',
    choiceCounts: (confirmed, modified) =>
      `${confirmed} confirm├® ┬À ${modified} nuanc├®`,
    deleteContent: 'Longola contenu',
    shareReflection: 'Kabola r├®flexion na ngai',
    verifyPesacheck: 'Tala na PesaCheck',
    recommendationLabel: 'Recommendation',
    dimensionsSummaryLabel: 'Ba dimensions 5',
    launching: 'Analyse ezali kosalaÔÇª',
    shareCopied: 'R├®flexion ekopi',
    continueWithoutAi: 'Kokoba sans IA',
    newModule: 'Module ya sika',
    offline: 'Connexion limit├®e. Okoki kokoba koyekola na nzela ya moko.',
    offlineCompass:
      'IA elali mpo ya connexion, kasi boussole na yo ekoki kokoba.',
    degradedBanner:
      'Analyse technique limit├®e ÔÇö ba services eza te. IA esalaki na ba preuves moke.',
    emptyDimensionsTitle: 'Analyse ezali te',
    emptyDimensionsHint: 'Bandisa v├®rification lisusu.',
    addImage: 'Bakisa photo',
    removeImage: 'Longola photo',
    confidence: (n) => `Confiance ${Math.round(n * 100)}%`,
    languageLabel: 'Mon╔ök╔ö',
  },
  sw: {
    brand: 'Media Compass',
    tagline: 'Jifunze kufikiria kabla ya kushiriki',
    landingHeadline: 'Jifunze kuekeza uamuzi wako kabla ya kushiriki',
    landingLead:
      'Media Compass inakufundisha kusoma maudhui, kuona ishara, kisha kuamua ÔÇö bila zana kufikiria kwa niaba yako.',
    landingCta: 'Ingia moduli',
    moduleLabel: 'Moduli ya uraia wa kidijitali',
    learnLabel: 'Lengo la kujifunza',
    railLabels: ['Kusanya', 'Uchunguzi', 'Tathmini', 'Tafakari', 'Muhtasari'],
    learnGoals: [
      'Wasilisha maudhui na uelewe utakachochunguza.',
      'Angalia kabla ya kuhukumu: tambua ishara na mbinu.',
      'Linganisha pendekezo la mfumo na uamuzi wako.',
      'Eleza athari ya kijamii ya kushiriki kwa wingi.',
      'Toka na muhtasari wazi na uamuzi wenye uwajibikaji.',
    ],
    selectedImageAlt: 'Picha iliyochaguliwa',
    placeholder: 'Bandika kiungo, maandishi au picha ya WhatsAppÔÇª',
    launch: 'Anzisha moduli',
    footer: 'Mfumo wa Transmission HumaineÔäó ┬À Media Compass',
    depositTitle: 'Lete maudhui ya kujifunza',
    analysisRunningTitle: 'Angalia kabla ya kuhukumu',
    analysisRunningHint: 'Kila hatua ni lengo la uchunguzi. Fuata mbinu.',
    analysisStep: (current, total) => `Lengo ${current} / ${total}`,
    coAnalysisTitle: 'Chambua pamoja vipimo 5',
    coAnalysisHint: (answered, total) =>
      `Masomo ┬À ${answered}/${total} ÔÇö mfumo unapendekeza, wewe unaamua`,
    why: 'Ona ushahidi',
    evidenceLabel: 'Ishara na ushahidi',
    yourDecision: 'Uamuzi wako',
    confirm: 'Nakubali pendekezo',
    modify: 'Naboresha / nasahihisha',
    modifyOpinionLabel: 'Maoni yako',
    modifyOpinionPlaceholder: 'Eleza kwa sentensi moja kwa nini unaboreshaÔÇª',
    continue: 'Endelea kwa tafakari',
    autoSuggestionLabel: 'Pendekezo la mfumo',
    autoSuggestionText: (suggestion) =>
      `Pendekezo: ${suggestion}. Thibitisha au ongeza nuance.`,
    thousandTestLabel: 'Daftari la tafakari',
    reflectionTitle:
      'Ikiwa vijana 10,000 wa DRC washiriki hii sasa, jamii inajifunza nini?',
    reflectionHint: 'Andika sentensi moja wazi. Hii ni kujifunza.',
    seeVerdict: 'Ona muhtasari wangu',
    verdictTitle: 'Muhtasari wa moduli',
    verdictLabel: 'Tahadhari inapendekezwa',
    riskConfidenceLabel: 'Kiwango cha tahadhari',
    reflectionCardTitle: 'Unachochukua',
    takeawayLabel: 'Muhtasari wa safari',
    choiceCounts: (confirmed, modified) =>
      `${confirmed} imethibitishwa ┬À ${modified} imeboreshwa`,
    deleteContent: 'Futa maudhui',
    shareReflection: 'Shiriki tafakari yangu',
    verifyPesacheck: 'Thibitisha kwenye PesaCheck',
    recommendationLabel: 'Pendekezo',
    dimensionsSummaryLabel: 'Vipimo 5',
    launching: 'Uchambuzi unaendeleaÔÇª',
    shareCopied: 'Tafakari imenakiliwa',
    continueWithoutAi: 'Endelea bila AI',
    newModule: 'Moduli mpya',
    offline:
      'Mtandao umepungua: unaweza kuendelea kuchambua mwenyewe na kujifunza.',
    offlineCompass:
      'AI imelala kwa sababu ya mtandao, lakini dira yako ya ndani inaweza kuendelea.',
    degradedBanner:
      'Uchambuzi wa kiufundi umepungua ÔÇö huduma zingine hazikupatikana.',
    emptyDimensionsTitle: 'Hakuna uchambuzi',
    emptyDimensionsHint: 'Anza ukaguzi mpya kutoka skrini iliyotangulia.',
    addImage: 'Ambatanisha picha',
    removeImage: 'Ondoa picha',
    confidence: (n) => `Kiwango cha uaminifu ${Math.round(n * 100)}%`,
    languageLabel: 'Lugha',
  },
}
