const custom = {
    input: {
        styles: {
            base: {
                container: {
                    position: "relative",
                    width: "w-full",
                    minWidth: "min-w-0",
                },
            },
            // variants: {
            //     static: {
                    
            //     }
            // }
        }
    },
    select: {
        styles: {
            base: {
                container: {
                    position: "relative",
                    width: "w-full",
                    minWidth: "min-w-0",
                },
            }
        }
    },
    dialog: {
        styles: {
            sizes: {
                xl: {
                    width: "w-full",
                    minWidth: "min-w-[95%] md:min-w-[83.333333%] 2xl:min-w-[75%]",
                    maxWidth: "max-w-[95%] md:max-w-[95%] 2xl:max-w-[95%]",
                },
            }
        }
    },
    accordion: {
        styles: {
            base: {
                header: {
                    initial: {
                        py: "py-1",
                    }
                },
                body: {
                    py: "py-0",
                }
            }
        }
    }
}
export default custom