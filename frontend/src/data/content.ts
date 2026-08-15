import type { DimensionLabel, Lang } from '../types'

const DIMENSION_LABELS_FR: DimensionLabel[] = [
  { key: 'source', title: 'SOURCE', question: "C'est qui le chef ?" },
  { key: 'evidence', title: 'EVIDENCE', question: 'Y a-t-il des preuves solides ?' },
  { key: 'intent', title: 'INTENT', question: 'Que cherche ce contenu ?' },
  { key: 'transmission', title: 'TRANSMISSION', question: 'Que normalise ce partage ?' },
  { key: 'impact', title: 'IMPACT', question: 'Quel effet sur la société ?' },
]

const DIMENSION_LABELS_EN: DimensionLabel[] = [
  { key: 'source', title: 'SOURCE', question: 'Who is behind this?' },
  { key: 'evidence', title: 'EVIDENCE', question: 'Is there solid proof?' },
  { key: 'intent', title: 'INTENT', question: 'What is this content trying to do?' },
  { key: 'transmission', title: 'TRANSMISSION', question: 'What does sharing this normalize?' },
  { key: 'impact', title: 'IMPACT', question: 'What effect on society?' },
]

const DIMENSION_LABELS_LN: DimensionLabel[] = [
  { key: 'source', title: 'SOURCE', question: 'Nani azali na nsima?' },
  { key: 'evidence', title: 'EVIDENCE', question: 'Ba preuves makasi ezali?' },
  { key: 'intent', title: 'INTENT', question: 'Contenu oyo elingi nini?' },
  { key: 'transmission', title: 'TRANSMISSION', question: 'Kokabola yango eza nini?' },
  { key: 'impact', title: 'IMPACT', question: 'Esali nini na société?' },
]

const DIMENSION_LABELS_SW: DimensionLabel[] = [
  { key: 'source', title: 'SOURCE', question: 'Nani yuko nyuma?' },
  { key: 'evidence', title: 'EVIDENCE', question: 'Kuna ushahidi imara?' },
  { key: 'intent', title: 'INTENT', question: 'Maudhui haya yanataka nini?' },
  { key: 'transmission', title: 'TRANSMISSION', question: 'Kushiriki kunahalalisha nini?' },
  { key: 'impact', title: 'IMPACT', question: 'Athari gani kwa jamii?' },
]

/** Labels i18n des 5 dimensions (sans données IA — celles-ci viennent du backend) */
export function getDimensionLabels(lang: Lang): DimensionLabel[] {
  if (lang === 'en') return DIMENSION_LABELS_EN
  if (lang === 'ln') return DIMENSION_LABELS_LN
  if (lang === 'sw') return DIMENSION_LABELS_SW
  return DIMENSION_LABELS_FR
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
    'Kotala source mpe domaine',
    'Koluka ba preuves oyo ezali',
    'Komona ba indices techniques',
    'Kolongisa co-analyse',
  ],
  sw: [
    'Angalia chanzo na kikoa',
    'Tafuta ushahidi unaopatikana',
    'Tambua ishara za kiufundi',
    'Andaa uchambuzi wa pamoja',
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
  entryHint: string
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
  nuanceHint: string
  lessonLabel: (n: number) => string
  statusHintSafe: string
  statusHintWarning: string
  statusHintRisk: string
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
  shareHint: string
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
  degradedMissing: readonly string[]
  degradedImpact: string
  scoreExplanation: (n: number) => string
  emptyDimensionsTitle: string
  emptyDimensionsHint: string
  addImage: string
  removeImage: string
  confidence: (n: number) => string
  languageLabel: string
  railAriaLabel: string
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
      'Colle un lien, un texte ou une capture WhatsApp…',
    entryHint:
      'Colle ce que tu as reçu : un lien, un message, ou une photo. Ensuite tu regarderas des indices, puis tu décideras toi-même.',
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
    yourDecision: 'Ton choix',
    confirm: 'Valider',
    modify: 'Corriger',
    modifyOpinionLabel: 'Pourquoi tu corriges',
    modifyOpinionPlaceholder: 'Dis en une phrase ce que tu corriges…',
    continue: 'Passer à la réflexion',
    autoSuggestionLabel: 'Proposition du système',
    autoSuggestionText: (suggestion) =>
      `Proposition : ${suggestion}. À toi de valider ou de corriger.`,
    nuanceHint: 'À toi de valider ou de corriger.',
    lessonLabel: (n) => `Étape ${String(n).padStart(2, '0')}`,
    statusHintSafe: 'Peu de signaux d’alerte. Vérifie quand même le contexte avant de partager.',
    statusHintWarning: 'Des doutes restent. Cherche une preuve ou une source fiable.',
    statusHintRisk: 'Beaucoup de signaux de risque. Ne partage pas sans vérifier.',
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
      `${confirmed} validées · ${modified} corrigées`,
    deleteContent: 'Supprimer le contenu',
    shareReflection: 'Partager ma réflexion',
    shareHint:
      'Ramène cette phrase dans le groupe ou le réseau où tu as vu le contenu (WhatsApp, Facebook…) pour expliquer ce que tu as compris — pas pour relancer la rumeur.',
    verifyPesacheck: 'Vérifier sur PesaCheck',
    recommendationLabel: 'Recommandation',
    dimensionsSummaryLabel: 'Les 5 dimensions',
    launching: 'Analyse en cours…',
    shareCopied: 'Réflexion copiée',
    continueWithoutAi: 'Continuer sans IA',
    newModule: 'Nouveau module',
    offline:
      'Connexion limitée : tu peux poursuivre l’analyse manuelle et continuer d’apprendre.',
    offlineCompass:
      'L’IA est endormie à cause de la connexion, mais ta boussole intérieure peut continuer.',
    degradedBanner:
      'Analyse limitée : certains contrôles n’ont pas pu être faits.',
    degradedMissing: [
      'La source et le site n’ont pas pu être vérifiés complètement',
      'Les preuves en ligne n’ont pas toutes été trouvées',
      'Les indices techniques (sécurité du lien, date, auteur) sont incomplets',
    ],
    degradedImpact:
      'Le résultat est moins sûr. Lis les 5 dimensions avec plus d’attention et vérifie sur PesaCheck avant de partager.',
    scoreExplanation: (n) =>
      n >= 70
        ? `Le score ${n} est élevé : peu de signaux d’alerte. Tu peux partager en restant attentif au contexte.`
        : n >= 40
          ? `Le score ${n} signifie prudence : plusieurs signaux demandent une vérification avant de partager.`
          : `Le score ${n} est bas : beaucoup de signaux de risque. Ne partage pas sans vérifier.`,
    emptyDimensionsTitle: 'Aucune analyse disponible',
    emptyDimensionsHint: 'Relance une vérification depuis l’écran précédent.',
    addImage: 'Joindre une capture',
    removeImage: 'Retirer l’image',
    confidence: (n) => `Indice de confiance ${Math.round(n * 100)}%`,
    languageLabel: 'Langue',
    railAriaLabel: 'Parcours d’apprentissage',
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
      'Paste a link, a message, or a WhatsApp screenshot…',
    entryHint:
      'Paste what you received: a link, a message, or a photo. Then you will look at clues and decide yourself.',
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
    yourDecision: 'Your choice',
    confirm: 'Validate',
    modify: 'Correct',
    modifyOpinionLabel: 'Why you correct it',
    modifyOpinionPlaceholder: 'Say in one sentence what you are correcting…',
    continue: 'Continue to reflection',
    autoSuggestionLabel: 'System proposal',
    autoSuggestionText: (suggestion) =>
      `Proposal: ${suggestion}. Validate it or correct it.`,
    nuanceHint: 'Validate it or correct it.',
    lessonLabel: (n) => `Step ${String(n).padStart(2, '0')}`,
    statusHintSafe: 'Few warning signs. Still check the context before sharing.',
    statusHintWarning: 'Some doubts remain. Look for proof or a trusted source.',
    statusHintRisk: 'Many risk signs. Do not share without checking.',
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
      `${confirmed} validated · ${modified} corrected`,
    deleteContent: 'Delete this content',
    shareReflection: 'Share my reflection',
    shareHint:
      'Take this sentence back to the group or network where you saw the content (WhatsApp, Facebook…) to explain what you understood — not to spread the rumor again.',
    verifyPesacheck: 'Verify on PesaCheck',
    recommendationLabel: 'Recommendation',
    dimensionsSummaryLabel: 'The 5 dimensions',
    launching: 'Analysis in progress…',
    shareCopied: 'Reflection copied',
    continueWithoutAi: 'Continue without AI',
    newModule: 'New module',
    offline:
      'Limited connection: you can continue manual analysis and keep learning.',
    offlineCompass:
      'AI is asleep due to the connection, but your inner compass can continue.',
    degradedBanner:
      'Limited analysis: some checks could not be completed.',
    degradedMissing: [
      'The source and website could not be fully verified',
      'Online evidence was not all found',
      'Technical clues (link safety, date, author) are incomplete',
    ],
    degradedImpact:
      'The result is less certain. Read the 5 dimensions more carefully and check PesaCheck before sharing.',
    scoreExplanation: (n) =>
      n >= 70
        ? `Score ${n} is high: few warning signs. You may share while staying mindful of context.`
        : n >= 40
          ? `Score ${n} means caution: several signs ask for a check before sharing.`
          : `Score ${n} is low: many risk signs. Do not share without verifying.`,
    emptyDimensionsTitle: 'No analysis available',
    emptyDimensionsHint: 'Start a new check from the previous screen.',
    addImage: 'Attach a screenshot',
    removeImage: 'Remove image',
    confidence: (n) => `Confidence index ${Math.round(n * 100)}%`,
    languageLabel: 'Language',
    railAriaLabel: 'Learning path',
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
    entryHint:
      'Tia oyo ozwaki: lien, message, to photo. Oko tala ba indices, sima yo moko ozwa décision.',
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
    yourDecision: 'Choix na yo',
    confirm: 'Kondima',
    modify: 'Kobongola',
    modifyOpinionLabel: 'Mpo nini obongoli',
    modifyOpinionPlaceholder: 'Lobela mwa sentence oyo obongoli…',
    continue: 'Kokende na réflexion',
    autoSuggestionLabel: 'Proposition ya système',
    autoSuggestionText: (suggestion) =>
      `Proposition: ${suggestion}. Kondima to kobongola.`,
    nuanceHint: 'Kondima to kobongola.',
    lessonLabel: (n) => `Etape ${String(n).padStart(2, '0')}`,
    statusHintSafe: 'Ba alarmes moke. Tala contexte liboso ya kokabola.',
    statusHintWarning: 'Mwa doute ezali. Luka preuve to source ya solo.',
    statusHintRisk: 'Ba alarmes mingi. Kokabola te soki otali te.',
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
      `${confirmed} ondimi · ${modified} obongoli`,
    deleteContent: 'Longola contenu',
    shareReflection: 'Kabola réflexion na ngai',
    shareHint:
      'Zongisa sentence oyo na groupe to réseau wapi omonaki contenu (WhatsApp, Facebook…) mpo koloba oyo oyebaki — te mpo kokabola lisusu rumuru.',
    verifyPesacheck: 'Tala na PesaCheck',
    recommendationLabel: 'Recommendation',
    dimensionsSummaryLabel: 'Ba dimensions 5',
    launching: 'Analyse ezali kosala…',
    shareCopied: 'Réflexion ekopi',
    continueWithoutAi: 'Kokoba sans IA',
    newModule: 'Module ya sika',
    offline: 'Connexion limitée. Okoki kokoba koyekola na nzela ya moko.',
    offlineCompass:
      'IA elali mpo ya connexion, kasi boussole na yo ekoki kokoba.',
    degradedBanner:
      'Analyse limitée: ba contrôles mosusu esalami te.',
    degradedMissing: [
      'Source mpe site etalami malamu te',
      'Ba preuves ya internet ezwami nyonso te',
      'Ba indices techniques (sécurité, date, mokomi) ezali moke',
    ],
    degradedImpact:
      'Résultat ezali moins sûr. Tala ba dimensions 5 na attention mpe tala PesaCheck liboso ya kokabola.',
    scoreExplanation: (n) =>
      n >= 70
        ? `Score ${n} ezali monene: ba alarmes moke. Okoki kokabola kasi tala contexte.`
        : n >= 40
          ? `Score ${n} elingi koloba: tala malamu liboso ya kokabola.`
          : `Score ${n} ezali moke: ba alarmes mingi. Kokabola te soki otali te.`,
    emptyDimensionsTitle: 'Analyse ezali te',
    emptyDimensionsHint: 'Bandisa vérification lisusu.',
    addImage: 'Bakisa photo',
    removeImage: 'Longola photo',
    confidence: (n) => `Confiance ${Math.round(n * 100)}%`,
    languageLabel: 'Monɔkɔ',
    railAriaLabel: 'Nzela ya koyekola',
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
    entryHint:
      'Bandika ulichopokea: kiungo, ujumbe, au picha. Kisha utaona ishara na kuamua mwenyewe.',
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
    yourDecision: 'Chaguo lako',
    confirm: 'Thibitisha',
    modify: 'Sahihisha',
    modifyOpinionLabel: 'Kwa nini unasahihisha',
    modifyOpinionPlaceholder: 'Eleza kwa sentensi moja unachosahihisha…',
    continue: 'Endelea kwa tafakari',
    autoSuggestionLabel: 'Pendekezo la mfumo',
    autoSuggestionText: (suggestion) =>
      `Pendekezo: ${suggestion}. Thibitisha au sahihisha.`,
    nuanceHint: 'Thibitisha au sahihisha.',
    lessonLabel: (n) => `Hatua ${String(n).padStart(2, '0')}`,
    statusHintSafe: 'Ishara chache za hatari. Angalia muktadha kabla ya kushiriki.',
    statusHintWarning: 'Mashaka bado. Tafuta ushahidi au chanzo salama.',
    statusHintRisk: 'Ishara nyingi za hatari. Usishiriki bila kuthibitisha.',
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
      `${confirmed} imethibitishwa · ${modified} imesahihishwa`,
    deleteContent: 'Futa maudhui',
    shareReflection: 'Shiriki tafakari yangu',
    shareHint:
      'Rudisha sentensi hii kwenye kikundi au mtandao ulipoiona (WhatsApp, Facebook…) kueleza ulichoelewa — si kueneza uvumi tena.',
    verifyPesacheck: 'Thibitisha kwenye PesaCheck',
    recommendationLabel: 'Pendekezo',
    dimensionsSummaryLabel: 'Vipimo 5',
    launching: 'Uchambuzi unaendelea…',
    shareCopied: 'Tafakari imenakiliwa',
    continueWithoutAi: 'Endelea bila AI',
    newModule: 'Moduli mpya',
    offline:
      'Mtandao umepungua: unaweza kuendelea kuchambua mwenyewe na kujifunza.',
    offlineCompass:
      'AI imelala kwa sababu ya mtandao, lakini dira yako ya ndani inaweza kuendelea.',
    degradedBanner:
      'Uchambuzi umepungua: baadhi ya ukaguzi haukuweza kukamilika.',
    degradedMissing: [
      'Chanzo na tovuti havikuhakikiwa kikamilifu',
      'Ushahidi mtandaoni haukupatikana wote',
      'Ishara za kiufundi (usalama wa kiungo, tarehe, mwandishi) si kamili',
    ],
    degradedImpact:
      'Matokeo si ya uhakika. Soma vipimo 5 kwa makini na thibitisha kwenye PesaCheck kabla ya kushiriki.',
    scoreExplanation: (n) =>
      n >= 70
        ? `Alama ${n} ni juu: ishara chache za hatari. Unaweza kushiriki ukizingatia muktadha.`
        : n >= 40
          ? `Alama ${n} inamaanisha tahadhari: ishara kadhaa zinahitaji ukaguzi kabla ya kushiriki.`
          : `Alama ${n} ni chini: ishara nyingi za hatari. Usishiriki bila kuthibitisha.`,
    emptyDimensionsTitle: 'Hakuna uchambuzi',
    emptyDimensionsHint: 'Anza ukaguzi mpya kutoka skrini iliyotangulia.',
    addImage: 'Ambatanisha picha',
    removeImage: 'Ondoa picha',
    confidence: (n) => `Kiwango cha uaminifu ${Math.round(n * 100)}%`,
    languageLabel: 'Lugha',
    railAriaLabel: 'Njia ya kujifunza',
  },
}
