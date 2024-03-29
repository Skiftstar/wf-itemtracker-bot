export const beautifyJSON = (jsonString: string) => {
    return jsonString.replaceAll(",", ",\n")
        .replaceAll("{", "{\n")
        .replaceAll("}", "\n}")
}

export const firstLetterUpper = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1)
}