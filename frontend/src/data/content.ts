import type { DimensionEval, Lang } from '../types'

const DIMENSIONS_FR: DimensionEval[] = [
  {
    key: 'source',
    title: 'SOURCE',
    question: "C'est qui le chef ?",
    aiSuggestion: 'Douteux',
    confidence: 0.89,
    status: 'warning',
    technicalReasons: [
      'Domaine créé il y a 48h',
      'Aucune mention légale trouvée',
      'Protocole non sécurisé (HTTP)',
    ],
  },
  {
    key: 'evidence',
    title: 'EVIDENCE',
    question: 'Y a-t-il des preuves solides ?',
    aiSuggestion: 'Faible',
    confidence: 0.76,
    status: 'risk',
    technicalReasons: [
      'Aucune source primaire citée',
      'Capture isolée, contexte manquant',
      'Signalé 4 fois sur PesaCheck',
    ],
  },
  {
    key: 'intent',
    title: 'INTENT',
    question: 'Que cherche ce contenu ?',
    aiSuggestion: 'Clickbait probable',
    confidence: 0.82,
    status: 'warning',
    technicalReasons: [
      'Langage sensationnaliste détecté',
      'Urgence artificielle (« partage vite »)',
      'Écart fort entre titre et corps',
    ],
  },
  {
    key: 'transmission',
    title: 'TRANSMISSION',
    question: 'Que normalise ce partage ?',
    aiSuggestion: 'Méfiance toxique',
    confidence: 0.71,
    status: 'warning',
    technicalReasons: [
      'Encouragement au partage sans vérification',
      'Cadre « nous vs eux » dominant',
      'Peu de place pour le doute raisonnable',
    ],
  },
  {
    key: 'impact',
    title: 'IMPACT',
    question: 'Quel effet sur la société ?',
    aiSuggestion: 'Risque élevé',
    confidence: 0.84,
    status: 'risk',
    technicalReasons: [
      'Peut polariser rapidement en RDC',
      'Amplifie la rumeur avant les faits',
      'Faible utilité publique mesurable',
    ],
  },
]

const DIMENSIONS_EN: DimensionEval[] = [
  {
    key: 'source',
    title: 'SOURCE',
    question: 'Who is behind this?',
    aiSuggestion: 'Doubtful',
    confidence: 0.89,
    status: 'warning',
    technicalReasons: [
      'Domain created 48 hours ago',
      'No legal notice found',
      'Insecure protocol (HTTP)',
    ],
  },
  {
    key: 'evidence',
    title: 'EVIDENCE',
    question: 'Is there solid proof?',
    aiSuggestion: 'Weak',
    confidence: 0.76,
    status: 'risk',
    technicalReasons: [
      'No primary source cited',
      'Isolated screenshot, missing context',
      'Flagged 4 times on PesaCheck',
    ],
  },
  {
    key: 'intent',
    title: 'INTENT',
    question: 'What is this content trying to do?',
    aiSuggestion: 'Likely clickbait',
    confidence: 0.82,
    status: 'warning',
    technicalReasons: [
      'Sensational language detected',
      'Artificial urgency (“share fast”)',
      'Strong mismatch between title and body',
    ],
  },
  {
    key: 'transmission',
    title: 'TRANSMISSION',
    question: 'What does sharing this normalize?',
    aiSuggestion: 'Toxic distrust',
    confidence: 0.71,
    status: 'warning',
    technicalReasons: [
      'Encourages sharing without verification',
      'Dominant “us vs them” framing',
      'Little room for reasonable doubt',
    ],
  },
  {
    key: 'impact',
    title: 'IMPACT',
    question: 'What effect on society?',
    aiSuggestion: 'High risk',
    confidence: 0.84,
    status: 'risk',
    technicalReasons: [
      'Can polarize quickly in the DRC',
      'Amplifies rumor before facts',
      'Low measurable public value',
    ],
  },
]

/** Fallback: FR structure for LN/SW until fully localized */
export const MOCK_DIMENSIONS: DimensionEval[] = DIMENSIONS_FR

export function getMockDimensions(lang: Lang): DimensionEval[] {
  if (lang === 'en') return DIMENSIONS_EN
  return DIMENSIONS_FR
}

export const ANALYSIS_STEPS: Record<Lang, readonly string[]> = {
  fr: [
    'Observer la source et le domaine',
    'Chercher des preuves disponibles',
    'Repérer les indices techniques',
    'Préparer la co-analyse guidée',
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
    'Repérer les indices techniques',
    'Préparer la co-analyse guidée',
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
  newModule: string
  offline: string
  addImage: string
  removeImage: string
  confidence: (n: number) => string
  languageLabel: string
}

export const COPY: Record<Lang, Copy> = {
  fr: {
    brand: 'Media Compass',
    tagline: 'Apprendre à penser avant de partager',
    landingHeadline: 'Apprendre à orienter ton jugement avant de partager',
    landingLead:
      'Media Compass t’entraîne à lire un contenu, observer des indices, puis décider — sans laisser l’outil penser à ta place.',
    landingCta: 'Entrer dans le module',
    moduleLabel: 'Module de citoyenneté numérique',
    learnLabel: 'Objectif d’apprentissage',
    railLabels: ['Collecte', 'Diagnostic', 'Évaluation', 'Réflexion', 'Synthèse'],
    learnGoals: [
      'Déposer un contenu réel et comprendre ce qu’on va examiner.',
      'Observer avant de juger : repérer indices et méthodes de vérification.',
      'Comparer la proposition du système à ton jugement critique.',
      'Formuler l’impact social d’un partage collectif.',
      'Retenir un bilan clair et une décision responsable.',
    ],
    selectedImageAlt: 'Capture sélectionnée',
    placeholder:
      'Colle un lien, un texte ou une capture WhatsApp fournie par ton enseignant…',
    launch: 'Commencer le module',
    footer: 'Cadre pédagogique Transmission Humaine™ · Media Compass',
    depositTitle: 'Apporter un contenu à étudier',
    analysisRunningTitle: 'Observer avant de juger',
    analysisRunningHint:
      'Chaque étape est un objectif d’observation. Prends le temps de suivre la méthode.',
    analysisStep: (current, total) => `Objectif ${current} / ${total}`,
    coAnalysisTitle: 'Co-analyser les 5 dimensions',
    coAnalysisHint: (answered, total) =>
      `Leçons validées · ${answered}/${total} — le système propose, tu décides`,
    why: 'Voir les indices',
    evidenceLabel: 'Indices & preuves',
    yourDecision: 'Ta décision d’apprenant',
    confirm: 'Je confirme la proposition',
    modify: 'Je nuance / je corrige',
    continue: 'Passer à la réflexion',
    autoSuggestionLabel: 'Proposition du système',
    autoSuggestionText: (suggestion) =>
      `Proposition : ${suggestion}. À toi de valider ou de nuancer.`,
    thousandTestLabel: 'Carnet de réflexion',
    reflectionTitle:
      'Si 10 000 jeunes en RDC partagent ce contenu maintenant, qu’apprend la société ?',
    reflectionHint: 'Écris une phrase claire. C’est ton apprentissage, pas une case à cocher.',
    seeVerdict: 'Voir mon bilan',
    verdictTitle: 'Bilan du module',
    verdictLabel: 'Prudence recommandée',
    riskConfidenceLabel: 'Niveau de vigilance acquis',
    reflectionCardTitle: 'Ce que tu retiens',
    takeawayLabel: 'Synthèse de ton parcours',
    choiceCounts: (confirmed, modified) =>
      `${confirmed} propositions confirmées · ${modified} avis nuancés`,
    deleteContent: 'Reprendre avec un autre contenu',
    shareReflection: 'Partager ma réflexion',
    newModule: 'Nouveau module',
    offline:
      'Connexion limitée : tu peux poursuivre l’analyse manuelle et continuer d’apprendre.',
    addImage: 'Joindre une capture',
    removeImage: 'Retirer l’image',
    confidence: (n) => `Indice de confiance ${Math.round(n * 100)}%`,
    languageLabel: 'Langue',
  },
  en: {
    brand: 'Media Compass',
    tagline: 'Learn to think before you share',
    landingHeadline: 'Learn to orient your judgment before you share',
    landingLead:
      'Media Compass trains you to read content, observe signals, then decide — without letting the tool think for you.',
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
      'Paste a link, text, or WhatsApp screenshot shared by your teacher…',
    launch: 'Start the module',
    footer: 'Human Transmission™ learning framework · Media Compass',
    depositTitle: 'Bring content to study',
    analysisRunningTitle: 'Observe before you judge',
    analysisRunningHint:
      'Each step is an observation goal. Follow the method carefully.',
    analysisStep: (current, total) => `Goal ${current} / ${total}`,
    coAnalysisTitle: 'Co-analyze the 5 dimensions',
    coAnalysisHint: (answered, total) =>
      `Lessons completed · ${answered}/${total} — the system proposes, you decide`,
    why: 'See the evidence',
    evidenceLabel: 'Signals & evidence',
    yourDecision: 'Your learner decision',
    confirm: 'I confirm the proposal',
    modify: 'I nuance / correct it',
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
      `${confirmed} confirmed · ${modified} nuanced`,
    deleteContent: 'Study another piece of content',
    shareReflection: 'Share my reflection',
    newModule: 'New module',
    offline:
      'Limited connection: you can continue manual analysis and keep learning.',
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
      'Media Compass epesa nzela ya kotánga contenu, kotala ba indices, mpe kozwa décision — outil ekosala te na esika na yo.',
    landingCta: 'Kokota na module',
    moduleLabel: 'Module ya citoyenneté numérique',
    learnLabel: 'Objectif ya koyekola',
    railLabels: ['Kobunda', 'Diagnostic', 'Évaluation', 'Réflexion', 'Synthèse'],
    learnGoals: [
      'Kotya contenu mpe koyeba oyo tokotala.',
      'Kotala liboso ya kozwa décision.',
      'Kokanisa proposition ya système na jugement na yo.',
      'Koloba impact ya société.',
      'Kobanga bilan clair mpe décision responsable.',
    ],
    selectedImageAlt: 'Foto oyo oponi',
    placeholder: 'Tia lien, texte to photo ya WhatsApp…',
    launch: 'Bandisa module',
    footer: 'Cadre Transmission Humaine™ · Media Compass',
    depositTitle: 'Kotya contenu ya koyekola',
    analysisRunningTitle: 'Kotala liboso ya kozwa décision',
    analysisRunningHint: 'Etape nyonso ezali objectif ya observation.',
    analysisStep: (current, total) => `Objectif ${current} / ${total}`,
    coAnalysisTitle: 'Co-analyser ba dimensions 5',
    coAnalysisHint: (answered, total) =>
      `Leçons · ${answered}/${total} — système epesa, yo ozwa décision`,
    why: 'Tala ba indices',
    evidenceLabel: 'Indices & preuves',
    yourDecision: 'Décision na yo',
    confirm: 'Nazui proposition',
    modify: 'Nabongoli / nanuance',
    continue: 'Kokende na réflexion',
    autoSuggestionLabel: 'Proposition ya système',
    autoSuggestionText: (suggestion) =>
      `Proposition: ${suggestion}. Confirme to nuance.`,
    thousandTestLabel: 'Carnet ya réflexion',
    reflectionTitle:
      'Soki bilenge 10 000 ya RDC bakabola yango lelo, société ekoyekola nini ?',
    reflectionHint: 'Lokasa moko ya solo. Yango ezali boyekoli.',
    seeVerdict: 'Tala bilan na ngai',
    verdictTitle: 'Bilan ya module',
    verdictLabel: 'Tika prudance',
    riskConfidenceLabel: 'Niveau ya vigilance',
    reflectionCardTitle: 'Oyo ozwaki',
    takeawayLabel: 'Synthèse ya parcours',
    choiceCounts: (confirmed, modified) =>
      `${confirmed} confirmé · ${modified} nuancé`,
    deleteContent: 'Kobanda na contenu mosusu',
    shareReflection: 'Kabola réflexion na ngai',
    newModule: 'Module ya sika',
    offline: 'Connexion limitée. Okoki kokoba koyekola na nzela ya moko.',
    addImage: 'Bakisa photo',
    removeImage: 'Longola photo',
    confidence: (n) => `Confiance ${Math.round(n * 100)}%`,
    languageLabel: 'Monɔkɔ',
  },
  sw: {
    brand: 'Media Compass',
    tagline: 'Jifunze kufikiria kabla ya kushiriki',
    landingHeadline: 'Jifunze kuekeza uamuzi wako kabla ya kushiriki',
    landingLead:
      'Media Compass inakufundisha kusoma maudhui, kuona ishara, kisha kuamua — bila zana kufikiria kwa niaba yako.',
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
    placeholder: 'Bandika kiungo, maandishi au picha ya WhatsApp…',
    launch: 'Anzisha moduli',
    footer: 'Mfumo wa Transmission Humaine™ · Media Compass',
    depositTitle: 'Lete maudhui ya kujifunza',
    analysisRunningTitle: 'Angalia kabla ya kuhukumu',
    analysisRunningHint: 'Kila hatua ni lengo la uchunguzi. Fuata mbinu.',
    analysisStep: (current, total) => `Lengo ${current} / ${total}`,
    coAnalysisTitle: 'Chambua pamoja vipimo 5',
    coAnalysisHint: (answered, total) =>
      `Masomo · ${answered}/${total} — mfumo unapendekeza, wewe unaamua`,
    why: 'Ona ushahidi',
    evidenceLabel: 'Ishara na ushahidi',
    yourDecision: 'Uamuzi wako',
    confirm: 'Nakubali pendekezo',
    modify: 'Naboresha / nasahihisha',
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
      `${confirmed} imethibitishwa · ${modified} imeboreshwa`,
    deleteContent: 'Anza na maudhui mengine',
    shareReflection: 'Shiriki tafakari yangu',
    newModule: 'Moduli mpya',
    offline:
      'Mtandao umepungua: unaweza kuendelea kuchambua mwenyewe na kujifunza.',
    addImage: 'Ambatanisha picha',
    removeImage: 'Ondoa picha',
    confidence: (n) => `Kiwango cha uaminifu ${Math.round(n * 100)}%`,
    languageLabel: 'Lugha',
  },
}
