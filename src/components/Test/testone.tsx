import { Box } from "@mantine/core"

export function Testone() {
    return (
        <Box 
            w={{ base: 320, sm: 480, lg: 640 }} 
            bg={{ base: 'blue.7', sm: 'red.7', lg: 'green.7' }}
        > 
        Hello
        </Box>
    )
}