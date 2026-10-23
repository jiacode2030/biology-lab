/* Clue table and "which approach?" items for the Which-approach trainer. */
METHODS.clues.push(
 ['Observed counts, expected ratio, "is the difference due to chance?"','Chi-square test: χ² = Σ(o − e)²/e, df = categories − 1, compare with the critical value'],
 ['Two parents\' genotypes, "probability that the offspring…"','Punnett square, or the product and sum rules'],
 ['Frequency of a recessive phenotype, "carriers", "allele frequency"','Hardy–Weinberg: p + q = 1 and p² + 2pq + q² = 1'],
 ['Genes on the same chromosome, many parental types, a few recombinants','Recombination frequency = recombinants / total × 100% = map units'],
 ['"Which way does water move", cell in a solution, turgid or plasmolyzed','Water potential: Ψ = Ψp + Ψs, Ψs = −iCRT; water moves high Ψ → low Ψ'],
 ['Potato or dialysis bag data, "isotonic concentration"','Percent change in mass, then the x-intercept of the graph (interpolate)'],
 ['"How fast", "rate", product made per minute','Rate = change in amount / change in time (slope of the graph)'],
 ['Rate at two temperatures','Q₁₀ = (R₂/R₁)^(10/(T₂ − T₁))'],
 ['Cell size, "exchange of materials", cube or sphere dimensions','Surface area to volume ratio (SA:V falls as size rises)'],
 ['Error bars, "is the difference real?", replicates','Mean, standard deviation, SEM = SD/√n; do the 2 × SEM bars overlap?'],
 ['Serial dilution, "how much stock to add"','Dilution: C₁V₁ = C₂V₂, or divide by the factor once per tube'],
 ['Reaction needs energy, coupled to ATP','Add the ΔG values: net ΔG = ΔG₁ + ΔG₂ (must be negative)'],
 ['Energy passed up a food chain','About 10% transfer per trophic level; NPP = GPP − R'],
 ['Population grows without limit, J-shaped curve','Exponential growth: dN/dt = r N'],
 ['Population levels off, carrying capacity K','Logistic growth: dN/dt = r N (K − N)/K; fastest at N = K/2'],
 ['Diversity of a sample, counts of each species','Simpson\'s index D = 1 − Σ(n/N)²'],
 ['Percent of one base in DNA, "how many hydrogen bonds"','Chargaff: A = T, G = C; G–C has 3 bonds, A–T has 2'],
 ['Template or coding strand, "write the mRNA"','Base pairing A–U, T–A, G–C, C–G; mRNA is antiparallel to the template'],
 ['mRNA sequence, "which amino acids", "how many amino acids"','Genetic code table from the first AUG; amino acids = codons before the stop'],
 ['One base changed, inserted or deleted','Classify: silent, missense, nonsense, or frameshift (not a multiple of 3)'],
 ['DNA copies after n cycles','PCR doubling: 2ⁿ copies'],
 ['Fragments on a gel, restriction digest','Smaller fragments travel farther; add the sizes to check the total'],
 ['Age of a fossil or rock from remaining isotope','Half-lives: remaining = (½)ⁿ, age = n × half-life'],
 ['Sequence differences between species, "when did they split"','Molecular clock: time = difference / (2 × rate); build the tree from the smallest differences'],
 ['Pedigree with affected males, carrier mother','X-linked recessive: sons get the X from the mother only'],
 ['Cells counted in each stage of mitosis','Time in stage = (cells in stage / total) × length of the cycle'],
 ['Allele frequency falls and a trait is favored','Natural selection (change in allele frequency over generations); name the mode of selection']
);
(function(){
  const T={chi:'Chi-square test',punn:'Punnett square or the product rule',hw:'Hardy–Weinberg equations',wp:'Water potential: Ψ = Ψp + Ψs, Ψs = −iCRT',q10:'Q₁₀ or rate calculation',pct:'Percent change in mass and interpolation',sav:'Surface area to volume ratio',sem:'SEM and error bars',pyr:'The 10% rule for energy transfer',log:'Logistic growth equation',expo:'Exponential growth equation',dil:'Dilution formula C₁V₁ = C₂V₂',simp:'Simpson\'s diversity index',charg:'Chargaff\'s rules',pcr:'Doubling: 2ⁿ copies',half:'Half-life calculation',map:'Recombination frequency (map units)',ped:'Pedigree analysis',dG:'Add the ΔG values (energy coupling)',gc:'Genetic code table and codon counting',npp:'NPP = GPP − R',mol:'Molecular clock',time:'Fraction of cells × cycle length',rt:'Slope of a graph (rate)'};
  const add=(q,right,wrong,explain)=>{const opts=[right,...wrong];const order=[0,1,2,3].sort(()=>Math.random()-.5);const shuffled=order.map(i=>opts[i]);METHODS.items.push({q,opts:shuffled,correct:shuffled.indexOf(right),explain});};
  add('Of 160 offspring, 98 are dominant and 62 recessive; you expected 3 : 1. Is the difference due to chance?',T.chi,[T.punn,T.hw,T.map],'Observed counts compared with an expected ratio: χ² with df = 1.');
  add('Two heterozygotes are crossed. What fraction of offspring is expected to be homozygous recessive?',T.punn,[T.chi,T.hw,T.map],'The cross gives 1/4 aa from a Punnett square.');
  add('In a population, 16% of people show a recessive trait. What fraction are carriers?',T.hw,[T.punn,T.chi,T.pct],'q² = 0.16, q = 0.4, p = 0.6, carriers 2pq = 0.48.');
  add('A test cross gives 450 and 450 parental types and 50 and 50 recombinants. How far apart are the genes?',T.map,[T.chi,T.punn,T.hw],'Recombinants 100/1000 = 10% = 10 map units.');
  add('A plant cell (0.4 M solute, Ψp = 0) sits in 0.1 M sucrose. Which way does water move?',T.wp,[T.pct,T.sav,T.q10],'Calculate Ψ for each side; water moves toward the more negative one.');
  add('Potato mass changes are given at several sucrose concentrations. Estimate the isotonic concentration.',T.pct,[T.wp,T.dil,T.sem],'Find where the percent change is zero by interpolating between neighbouring data points.');
  add('Reaction rate is 5 µmol/min at 20 °C and 12 µmol/min at 30 °C. How does it respond to a 10 °C rise?',T.q10,[T.rt,T.sav,T.half],'Compare the two rates to get Q₁₀ = 12/5 = 2.4.');
  add('A cell doubles in diameter. Does its ability to take in nutrients per unit of volume go up or down?',T.sav,[T.q10,T.wp,T.dG],'SA:V falls as size increases, so exchange per volume decreases.');
  add('Two groups have means of 20 and 26 with SEM = 1.5 each. Is the difference likely real?',T.sem,[T.chi,T.hw,T.dil],'Compare ± 2 SEM (3.0) for each mean: the bars do not overlap.');
  add('You have a 1 M stock and need 200 mL of 0.1 M solution.',T.dil,[T.q10,T.sem,T.pct],'V₁ = (0.1 × 200)/1 = 20 mL of stock.');
  add('A reaction needs +25 kJ/mol. ATP hydrolysis gives −30.5 kJ/mol. Will the coupled reaction go?',T.dG,[T.q10,T.pyr,T.wp],'Net ΔG = +25 − 30.5 = −5.5 kJ/mol, which is negative.');
  add('Producers hold 20,000 kJ. How much energy reaches secondary consumers?',T.pyr,[T.npp,T.log,T.simp],'Two transfers at 10% each: 20,000 → 2,000 → 200 kJ.');
  add('GPP is 12,000 and the producers\' respiration is 4,500 kJ per m² per year. What can consumers use?',T.npp,[T.pyr,T.log,T.expo],'NPP = GPP − R = 7,500.');
  add('A population of 50 grows by 10% per year with unlimited resources. What is the growth rate dN/dt?',T.expo,[T.log,T.pyr,T.simp],'dN/dt = r N = 0.10 × 50 = 5 per year.');
  add('A population of 400 with r = 0.3 and K = 1,000 is limited by resources. What is its growth rate?',T.log,[T.expo,T.npp,T.pyr],'dN/dt = r N (K − N)/K = 0.3 × 400 × 0.6 = 72.');
  add('A sample has 30, 20 and 10 individuals of three species. How diverse is it?',T.simp,[T.sem,T.pyr,T.chi],'D = 1 − Σ(n/N)² with N = 60.');
  add('DNA is 30% adenine. What percent is guanine?',T.charg,[T.hw,T.chi,T.map],'A = T = 30%, so G + C = 40% and G = 20%.');
  add('A template reads 3′-TACGGA-5′. What amino acids does the mRNA code for?',T.gc,[T.charg,T.pcr,T.hw],'Transcribe to AUGCCU, then use the code: Met–Pro.');
  add('Starting from one DNA molecule, how many copies of the target after 12 PCR cycles?',T.pcr,[T.half,T.log,T.dil],'Each cycle doubles the number: 2¹².');
  add('A sample has 6.25% of its original carbon-14. The half-life is 5,730 years. How old is it?',T.half,[T.pcr,T.q10,T.expo],'6.25% = (½)⁴, so 4 half-lives: 22,920 years.');
  add('Two species differ at 10% of their sequence and each lineage changes at 0.5% per million years. When did they split?',T.mol,[T.half,T.map,T.q10],'Time = 10/(2 × 0.5) = 10 million years.');
  add('A trait appears mostly in sons of unaffected mothers and never passes from father to son. Which pattern is it?',T.ped,[T.chi,T.hw,T.map],'X-linked recessive inheritance, shown by a pedigree analysis.');
  add('200 root tip cells are counted; 12 are in metaphase. The cell cycle is 20 hours. How long is metaphase?',T.time,[T.rt,T.map,T.pct],'12/200 × 20 = 1.2 hours.');
})();
