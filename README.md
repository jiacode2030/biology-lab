# Biology Lab

An interactive, intuition-first study site for **AP Biology**: live simulations of membranes, enzymes, inheritance, evolution and ecosystems, step-by-step worked examples, randomized practice, original free-response questions and an exam builder.

Unofficial study aid. Not affiliated with the College Board. AP and Advanced Placement are trademarks registered by the College Board.

## Build and test
```
python3 tools/mk.py   # regenerate module pages from tools/units/*.py
python3 build.py      # writes index.html (needs Python 3 and Node)
node tests/flow.js
N=400 node tests/audit.js
node tests/check.js [moduleId ...]
```
See `CLAUDE.md` for the layout and rules. localStorage keys start with `bio-`. Report issues with the **Report an issue** link on any page (opens an issue in `jiacode2030/ap-labs-feedback`).
