// (C) 2007-2019 GoodData Corporation
import React, { useState, Component } from "react";
import ReactDOM from "react-dom";
import { SourceContainer } from "./SourceContainer";
import { UnControlled as CodeMirror } from "react-codemirror2";
import ReactHtmlParser from "react-html-parser";
import { BarChart } from "@gooddata/sdk-ui-charts";
import { Ldm, LdmExt } from "../ldm";
// import * as uuid from 'uuid';
// import invariant from 'invariant';
// import Frame from 'react-frame-component';
import { BubbleChartExample } from "../examples/basic/BubbleChartExample";
const style = { height: 300 };
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import fs from "fs";
import { BarChartExample } from "../examples/basic/BarChartExample";
import { renderIntoDocument } from "react-dom/test-utils";
// import {measureColumnWidthItemSimple} from "../../../../libs/sdk-ui-tests/stories/end-to-end/pivotTable/widthItems";
// import {newAttributeLocator} from "../../../../libs/sdk-model/src";
// import {IMenuProps} from "../../../../libs/sdk-ui-pivot/src/menu/Menu";
interface IExampleWithSourceProps {
    for: React.ComponentType;
    source: string;
    sourceJS?: string;
}

export interface ICodeMirrorProps {
    runCode: boolean;
    code: string;
}

export interface IReactNodeProps {
    reactNode: React.ReactNode;
}

class MyComponent extends Component<ICodeMirrorProps> {
    componentNames = {
        bubbleChartExamples: BubbleChartExample,
        barChartExamples: BarChartExample,
    };
    render() {
        // @ts-ignore
        const TagName = this.componentNames[this.props.code];
        // const props = {measures: [LdmExt.TotalSales1], viewBy: Ldm.LocationResort};
        // return <TagName {...props} />
        return <TagName />;
    }
}
//
// const typeChart = {
//     barChart: BarChart,
//     barChartExamples: BarChartExample
// };

// class Abc extends Component {
//     public render(): React.ReactNode {
//         return (
//             <div style={style}>
//                 <JsxParser components={{ BubbleChartExample }} jsx={"<BubbleChartExample/>"} />
//                 <BarChart measures={[LdmExt.TotalSales1]} viewBy={Ldm.LocationResort} />
//             </div>
//         );
//     }
// }

export const DiffChart = (props: ICodeMirrorProps) => {
    // ReactHtmlParser(props.code);
    // var parser = new DOMParser();
    // const abc = parser.parseFromString("BarChart", "text/html");
    // function creathtml() {
    //     return { __html: "<button>abc</button>" };
    // }
    // renderIntoDocument()
    // const e = document.createElement("div")
    // eval("import React from \"react\";\n" +
    //     "import { BarChart } from \"@gooddata/sdk-ui-charts\";\n" +
    //     "import { Ldm, LdmExt } from \"../../ldm\";\n" +
    //     "\n" +
    //     "const style = { height: 300 };\n" +
    //     "\n" +
    //     "export const MinhExample: React.FC = () => {\n" +
    //     "    return (\n" +
    //     "        <div style={style} className=\"s-bar-chart\">\n" +
    //     "            <BarChart measures={[LdmExt.TotalSales1]} viewBy={Ldm.LocationResort} />\n" +
    //     "        </div>\n" +
    //     "    );\n" +
    //     "};")
    // React.createElement(BarChart, { measures: [LdmExt.TotalSales1], viewBy: Ldm.LocationResort });
    return (
        <MyComponent runCode={true} code={props.code} />
        // <div dangerouslySetInnerHTML={creathtml()}>
        //     {/*{abc}*/}
        //     {/*<BarChart measures={[LdmExt.TotalSales1]} viewBy={Ldm.LocationResort} />*/}
        // </div>
        // React.createElement(MyComponent, {runCode: true, code:})
    );
};

// const measureWidth = (props: ICodeMirrorProps) => {
//     return (props.code);
//
// };
export const ExampleWithSource: React.FC<IExampleWithSourceProps> = ({
    for: Component,
    source,
    sourceJS,
}) => {
    const [hidden, setState] = useState<boolean>(true);
    const [viewJS, setViewJS] = useState<boolean>(true);
    const [props, setProps] = useState<ICodeMirrorProps>({
        runCode: false,
        code: "bubbleChartExamples",
    });
    // const [css, setSource] = useState<React.FC>(BarChartExample)
    // var css = <h1>Supprise at hereeeeeeee</h1>

    const toggle = () => setState(!hidden);
    const runCode = () => {
        // @ts-ignore
        setProps({ runCode: true, code: "barChartExamples" });
        // css = React.createElement(MyComponent, { runCode: props.runCode, code: props.code })
        // ReactDOM.render(
        //     React.createElement(MyComponent, { runCode: props.runCode, code: props.code }),
        //     // <button>abc</button>,
        //     // <DiffChart
        //     //     runCode= {props.runCode}
        //     //     code='barChartExamples'
        //     // />,
        //     document.getElementById("kl1"),
        // );

        // var splitted = props.code.split(/<[^>]*(.*?)\/>/);
        // ReactDOM.render(<MyComponent/>, document.getElementById("kl1"));
        // const dir = "webpack:///src/components/Menu.tsx";
        // fs.writeFile(dir, props.code, (err) => {
        //     // throws an error, you could also catch it here
        //     if (err) throw err;
        //
        //     // success case, the file was saved
        //     console.log("Lyric saved!");
        // });
    };
    const chart = React.createElement(BarChart, {
        measures: [LdmExt.TotalSales1],
        viewBy: Ldm.LocationResort,
    });
    const switchLang = (switchToJS: boolean) => setViewJS(switchToJS);
    const iconClassName = hidden ? "icon-navigatedown" : "icon-navigateup";
    // @ts-ignore
    return (
        <div className="example-with-source">
            <style jsx>{`
                .example-with-source {
                    flex: 1 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                    margin-top: 30px;
                }

                .example {
                    padding: 20px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
                    background-color: white;
                }

                .source {
                    margin: 20px 0;
                }

                :global(pre) {
                    overflow: auto;
                }
            `}</style>
            <div className="example">
                <Component />
            </div>
            <div className="source">
                <button
                    className={`gd-button gd-button-secondary button-dropdown icon-right ${iconClassName}`}
                    onClick={toggle}
                >
                    source code
                </button>
                <button className={`gdc-button button-run`} onClick={runCode}>
                    run code
                </button>
                {hidden ? (
                    ""
                ) : (
                    <div>
                        <SourceContainer
                            toggleIsJS={switchLang}
                            isJS={viewJS}
                            source={source}
                            sourceJS={sourceJS}
                        />
                    </div>
                )}
                <CodeMirror
                    value={props.code}
                    options={{
                        mode: "typescript",
                        theme: "material",
                        lineNumbers: true,
                    }}
                    //@ts-ignore
                    onChange={(editor, data, value) => {
                        setProps({
                            runCode: false,
                            code: value,
                        });
                    }}
                />
                {/*<iframe srcDoc={props.code}></iframe>*/}
            </div>
            <div className="Output" id="kl1">
                "<h1>Supprise at here</h1>"{/*{css}*/}
                <MyComponent runCode={props.runCode} code={props.code} />
                );
            </div>
        </div>
    );
};
