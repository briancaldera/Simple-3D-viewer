import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Viewport from "@/components/Viewport";

const handleStyle: string = "border-2"
const panelStyle: string = ""
const parentStyle: string = ""

const BaseLayout = ({topbar, children}) => {

    return (
        <main className={"dark size-full dark:bg-gray-800"}>
            <ResizablePanelGroup direction={"horizontal"} className={"min-h-[200px] w-full rounded-lg border-4 dark:bg-gray-900"}>
                <ResizablePanel >
                    <ResizablePanelGroup direction={"vertical"}>
                        <ResizablePanel defaultSize={3} minSize={2} maxSize={10}>

                        </ResizablePanel>
                        <ResizableHandle className={handleStyle} withHandle/>
                        <ResizablePanel>
                            <Viewport />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle className={handleStyle} withHandle/>
                <ResizablePanel defaultSize={20} minSize={10} maxSize={30}></ResizablePanel>
            </ResizablePanelGroup>
        </main>
    )
}

export default BaseLayout