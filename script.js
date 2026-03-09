let allIssues = [];

// ১. ডাটা ফেচ করা
async function fetchIssues() {
    const spinner = document.getElementById('loading-spinner');
    try {
        if (spinner) spinner.classList.remove('hidden');
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data;
        displayIssues(allIssues);
    } catch (error) {
        console.error("Fetch Error:", error);
    } finally {
        if (spinner) spinner.classList.add('hidden');
    }
}

// ২. কার্ড রেন্ডার করা (আপনার সব রিকয়ারমেন্ট এখানে)
function displayIssues(issues) {
    const container = document.getElementById('issues-container');
    const countLabel = document.getElementById('issue-count');
    container.innerHTML = "";
    countLabel.innerText = issues.length;

    issues.forEach(issue => {
        // স্ট্যাটাস অনুযায়ী PNG এবং বর্ডার
        const statusIcon = issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status.png';
        const borderClass = issue.status === 'open' ? 'border-t-green-400' : 'border-t-purple-500';
        
let prioStyle = "";
const priority = issue.priority.toLowerCase(); // ডাটা ছোট বা বড় হাতের যাই হোক, এটি কাজ করবে

if(priority === 'high') {
    prioStyle = "bg-red-100 text-red-600 border-red-200";
} else if(priority === 'medium') {
    prioStyle = "bg-orange-100 text-orange-600 border-orange-200";
} else {
    prioStyle = "bg-green-50 text-green-600 border-green-100"; // Low এর জন্য
}
        const card = document.createElement('div');
        card.className = `bg-white p-5 rounded-2xl border-t-4 ${borderClass} border-x border-b border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`;
        
        // কার্ডে ক্লিক করলে মডাল ওপেন হবে
        card.onclick = () => openModal(issue);

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-4">
                    <img src="${statusIcon}" class="w-5 h-5" alt="status">
                    <span class="${prioStyle} px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider">${issue.priority}</span>
                </div>
                <h3 class="font-bold text-gray-800 text-sm mb-2 line-clamp-1">${issue.title}</h3>
                <p class="text-[11px] text-gray-400 line-clamp-2 mb-4 h-8">${issue.description}</p>
                <div class="flex gap-2 mb-4">
                    <span class="bg-red-100 text-red-600 px-1 py-1 rounded-md text-[9px] font-bold border border-red-300 uppercase italic"><i class="fa-solid fa-bug"></i>Bug</span>
                    <span class="bg-orange-100 text-orange-600 px-1 py-1 rounded-md text-[9px] font-bold border border-orange-300 uppercase italic"><i class="fa-regular fa-life-ring"></i>Help Wanted</span>
                </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                <span>#${issue.id || '1'} by ${issue.author}</span>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function openModal(issue) {
    const modalContent = document.getElementById('modal-content');
    
    // Status Badge Logic
    const statusBg = issue.status === 'open' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-[#6366f1]';
    
    // Priority Logic (Your new code)
    let prioStyle = "";
    const priority = issue.priority.toLowerCase();

    if (priority === 'high') {
        prioStyle = "bg-red-500 text-white border-red-200 ";
    } else if (priority === 'medium') {
        prioStyle = "bg-orange-500 text-white border-orange-200";
    } else {
        prioStyle = "bg-green-500 text-white border-green-200";
    }

    let statusbg = "";
    if(issue.status.toLowerCase() === 'open') {
        statusbg = "bg-green-500 text-white";
    } else {
        statusbg = "bg-indigo-500 text-white";
    }

    modalContent.innerHTML = `
        <div class="flex flex-col gap-1">
            <h2 class="text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                ${issue.title}
            </h2>
            <div class="flex items-center justify-between">
                <span class="${statusbg} px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[2px]">
                    ${issue.status}
                </span>
                <span class="text-[11px] text-gray-300 font-bold uppercase tracking-widest">
                    Posted on ${new Date(issue.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div class="bg-[#F8FAFC] p-8 rounded-[24px] border border-gray-100">
                <p class="text-gray-500 text-base leading-relaxed">
                    ${issue.description}
                </p>
            </div>

            <div class="grid grid-cols-3 gap-8 pt-8 mt-4 border-t border-gray-100">
                <div class="flex flex-col gap-1">
                    <span class="text-[10px] uppercase font-black text-gray-400 tracking-widest">Reporter</span>
                    <span class="text-base font-bold text-gray-800">${issue.author}</span>
                </div>
                
                <div class="flex flex-col gap-1 border-x border-gray-100 px-6 items-center">
    <span class="text-[10px] uppercase font-black text-gray-400 tracking-widest">Priority</span>
    
    <div class="w-fit">
        <span class="${prioStyle} px-4 py-1 rounded-md text-[12px] font-bold inline-block">
            ${issue.priority}
        </span>
    </div>
</div>

                <div class="flex flex-col gap-1">
                    <span class="text-[10px] uppercase font-black text-gray-400 tracking-widest">Category</span>
                    <span class="text-base font-bold text-gray-800">Software Bug</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('issue_modal').showModal();
}

// ৪. ট্যাব ফিল্টারিং লজিক
function filterIssues(status, element) {
    const tabs = document.querySelectorAll('.join-item');
    tabs.forEach(tab => {
        tab.classList.remove('tab-active-purple');
        tab.classList.add('bg-transparent', 'text-gray-500');
    });

    if (element) {
        element.classList.remove('bg-transparent', 'text-gray-500');
        element.classList.add('tab-active-purple');
    }

    if (status === 'all') displayIssues(allIssues);
    else displayIssues(allIssues.filter(i => i.status === status));
}

// ৫. সার্চ লজিক
async function handleSearch() {
    const text = document.getElementById('search-input').value.trim();
    if (!text) return displayIssues(allIssues);
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
    const data = await res.json();
    displayIssues(data.data);
}

fetchIssues();