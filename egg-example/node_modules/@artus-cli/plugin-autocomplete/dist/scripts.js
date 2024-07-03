"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    zsh(binName, binFile) {
        return `
# ${binName} completions in zsh
_${binName}_artus_cli_completions()
{
  local reply
  local si=$IFS
  IFS=$'\n'
  reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" ${binFile} --get-completion-argv="\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _${binName}_artus_cli_completions ${binName}
    `;
    },
    bash(binName, binFile) {
        return `
# ${binName} completions in bash
_${binName}_artus_cli_completions()
{
    local cur_word args type_list
    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")
    type_list=$(${binFile} --get-completion-argv="\${args[@]}")
    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi
    return 0
}
complete -o bashdefault -o default -F _${binName}_artus_cli_completions ${binName}
    `;
    },
};
