#!/bin/bash
# Save as fix-git-case.sh and run with bash fix-git-case.sh

git ls-files | while read file; do
  # Get lowercase version
  lc_file=$(echo "$file" | tr '[:upper:]' '[:lower:]')

  # Skip if the file is already lowercase or the names are identical
  if [ "$file" = "$lc_file" ]; then
    continue
  fi

  # Check if Git sees it as a case change
  if git ls-files | grep -i "^${lc_file}$" > /dev/null; then
    # Use a temporary name to avoid case collision issues
    tmp_name="${file}_tmp_rename"
    git mv "$file" "$tmp_name"
    git mv "$tmp_name" "${file}"
    echo "Fixed case for: $file"
  fi
done
