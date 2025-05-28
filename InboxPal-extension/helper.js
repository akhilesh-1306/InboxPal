function createButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO V7 T-I-atl L3';
    button.style.marginRight = '6px';
    button.innerHTML = "InboxPal Reply";
    button.setAttribute("role","button");
    button.setAttribute("data-tooltip","Generate reply");
    return button
}

function getToolbar(){
    const selectors = [
        '.btC','.aDh','[role="toolbar"]','.gU.Up'
    ];
    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
    }
    return null;
}

function injectButton(){
    const existingButton = document.querySelector('.inboxpal-reply-button');
    if(existingButton){
        existingButton.remove();
    }

    const toolbar = getToolbar();
    if(!toolbar){
        return;
    }

    const button = createButton();
    button.classList.add('inboxpal-reply-button');

    button.addEventListener("click",async ()=>{
        try{
            button.innerHTML = "Generating reply...";
            button.style.opacity = 0.3;
            const selectors = [
                '.h7','.a3s.aiL','.gmail_quote','[role="presentation"]'
            ];
            let emailContent = "";
            for(const selector of selectors){
                content = document.querySelector(selector);
                if(content){
                    emailContent = content.innerHTML.trim();
                    break;
                }
            }
            const response = await fetch('http://localhost:8080/api/email-generator/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({emailContent, tone: "Formal"})
            });
            if(!response.ok){
                throw new Error("Error generating reply");
            }
            const reply = await response.text();
            const replyBox = document.querySelector('[role="textbox"],[g_editable="true"]');
            if(replyBox){
                replyBox.focus();
                document.execCommand('insertText', false, reply);
            }
        }catch(error){
            console.error(error);
            alert("Error generating reply");
        }finally{
            button.innerHTML = "InboxPal Reply";
            button.style.opacity = 1;
        }
    });
    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node=>
            node.nodeType === Node.ELEMENT_NODE && (node.matches('.aDh,.btC,[role="dialog"]') || node.querySelector('.aDh,.btC,[role="dialog"]'))
        );
        if(hasComposeElements){
            setTimeout(injectButton,500);
        }
    }
})

observer.observe(document.body,{childList:true,subtree:true});