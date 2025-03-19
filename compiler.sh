#!/bin/bash

npx google-closure-compiler \
--js "./PostIt.js" \
--js "./LowerMeny.js" \
--js "./UpperMeny.js" \
--js "./Main.js" \
--js_output_file "./i3compiled.js" \
--compilation_level  SIMPLE \
--warning_level DEFAULT