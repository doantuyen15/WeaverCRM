import type { InputStylesType } from "@material-tailwind/react";

// interface InputStateStylesType {
//     input: object;
//     label: object;
//     styles: object
//   }

const input: InputStylesType = {
    styles: {
        base: {
            container: {
                position: "relative",
                width: "w-full",
                minWidth: "min-w-0",
            },
        },
        variants: {
            static: {
                sizes: {
                    md: {
                        container: {
                            height: "h-11",
                        },
                        input: {
                            fontSize: "text-sm",
                            pt: "pt-0",
                            pb: "pb-0",
                        },
                    }
                }
            },
            outlined: {},
            standard: {}
        }
    },
}
  
const custom = {
    input: input,
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
    },
    menu: {
        defaultProps: {
            placement: "bottom",
            offset: 5,
            dismiss: {
                itemPress: true
            },
            animate: {
                unmount: {},
                mount: {},
            },
            lockScroll: false,
        },
        styles: {
            base: {
                menu: {
                    minWidth: "min-w-[10px]",
                }
            }
        }
    }
}
export default custom