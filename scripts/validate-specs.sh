#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
validation_env="${repository_root}/.venv-specs"

if [[ ! -x "${validation_env}/bin/python" ]]; then
  python3 -m venv --system-site-packages "${validation_env}"
fi

if ! "${validation_env}/bin/python" -c "import yaml" 2>/dev/null; then
  "${validation_env}/bin/python" -m pip install \
    --disable-pip-version-check \
    --quiet \
    --requirement "${repository_root}/requirements-specs.txt"
fi

"${validation_env}/bin/python" "${repository_root}/scripts/validate-specs.py"
