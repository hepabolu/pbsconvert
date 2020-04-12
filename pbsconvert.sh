#!/bin/bash

# convert all PBS HTML files to Markdown
# so we can get the entire set of shownotes together on GitHub

OUTPUTDIR=../convert2

for f in ../sourcefiles/*.html
do
    PBSNO=$(echo $f | cut -d' ' -f 2)
    PBSMD=pbs${PBSNO}.md
    node index.js "${f}" --output ${OUTPUTDIR}/${PBSMD}
done
