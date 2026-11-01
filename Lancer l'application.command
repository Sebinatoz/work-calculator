#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "$DIR/index.html"
else
  xdg-open "$DIR/index.html" 2>/dev/null || sensible-browser "$DIR/index.html" 2>/dev/null || open "$DIR/index.html"
fi
