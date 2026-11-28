#!/bin/bash
# Renames every tracked file that has an uppercase letter to a temporary name and back with git mv.

git ls-files | while read file; do
  # Get lowercase version
  lc_file=$(echo "$file" | tr '[:upper:]' '[:lower:]')

  # Skip files without uppercase letters
  if [ "$file" = "$lc_file" ]; then
    continue
  fi

  # Case-insensitive match, so the file itself always matches and every file reaching this point is renamed
  if git ls-files | grep -i "^${lc_file}$" > /dev/null; then
    # Use a temporary name to avoid case collision issues
    tmp_name="${file}_tmp_rename"
    git mv "$file" "$tmp_name"
    git mv "$tmp_name" "${file}"
    echo "Fixed case for: $file"
  fi
done
