import { LeavingQuestion } from './leaving,model';

export const LEAVING_OVERVIEW: LeavingQuestion[] = [
    {
        id: 'what-is-this',
        type: 'string',
        q: 'What is this?',
        a: [
            "Once upon a time I did a PhD in the history of architecture. After a postdoc, I left academia and my field and now have a very satisfing career in a completely different field (data visualization/web development + design). I learned a tremendous amount during that process and feel like it's a waste to keep it to myself. I've had a number of conversations with current academics (mostly PhD students or recent PhDs) about leaving and wanted to jot down some of the things I find myself saying many times, with the hope that it will be useful to others.",
        ],
    },
    {
        id: 'who-is-this-for',
        type: 'string',
        q: 'Who is this for?',
        a: [
            "This is intended for anyone in academia who has ever had a thought about leaving, whether out of frustration, necessity, or whatever other reason. My experience is that almost everyone, including people who go on to have very successful academic careers, has had this thought. Nonetheless, it seems like there is a lot of discomfort around it, and as a result, it is a thought that people often seem to have alone. I hope that my experiences can provide context for people's own thoughts on this subject and can also help to normalize them. Above all, I hope that sharing my experiences helps people better know what to do when they are thinking about leaving academia.",
            'Because I have a humanities degree with no clear industry afterlife, and was in a field and program in which very very few people have left academia / the field before, my thoughts are probably most useful for people coming from similar situations.',
        ],
    },
];

export const LEAVING_ME: LeavingQuestion[] = [
    {
        id: 'how-did-you-know',
        type: 'string',
        q: 'How did you know you wanted to leave academia?',
        a: [
            "I first started imagining alternate careers when I was abroad doing dissertation research, completely unstimulated by and lost with my work. Mostly these were fantasies of jobs that were exaggerated opposites of an academic career and they likely wouldn't have been something I wanted to pursue long-term.",
            "Those fantasies abated, but several years later, stuck and frustrated in the writing phase of my dissertation (and now abroad on a different continent), I had an important revelation: I realized and admitted to myself how miserable I was. This thought hadn't come to my mind before because all I could think about was my dissertation progress. If someone had asked me if I was happy I would have likely said, \"well, I'm behind in my dissertation writing and who knows how I'll get funding for next year and then what about the job market after I finish so, I don't know, I guess it's kind of hard to be happy under those circumstances.\" In other words, I hadn't been thinking of my happiness as either something valuable or something that I had control over before this.",
            'Realizing how unhappy I was, I tried to assess how and when that would change if I stayed in academia. I tried to imagine the best outcome possible for me in the field. Actually, I tried to imagine one that was far better than what was actually possible, and I saw myself ten years later, still miserable and feeling like a fraud, even as a tenured professor at some very fancy school.',
            "I also realized—or rather, finally admitted to myself—that I just had no investment in my field anymore. The most engaging courses I took as a PhD student were all outside of my field, and I couldn't figure out how to translate them into scholarship in my field. I didn't want to buy books in my field anymore and it felt to me that the field was overwhelmingly just talking among itself, without much to say to the world at large. Needless to say, I felt like I had nothing truly meaningful to say within it.",
            "Additionally, the job market was just getting worse and worse. I knew that my chances of getting a job were not great—especially since I had nothing to say! (ha)—and I knew that if I was already miserable as a PhD student / postdoc, things would only get worse—and probably way worse—if I were barely scraping by financially and moving every semester for VAP jobs. That life is challenging for anyone, but if you actually aren't even excited by your field and doing work within it (with the exception of teaching which I have always loved but we all know that your career is made on scholarship), I just found myself saying, why would I subject myself to that? I could not think of a single reason.",
            "I will say that a bright spot in all of this was that while I was done with my own field, there were many other things that I did find very interesting as I encountered them. I was spending time in Singapore and loved learning as much as I could about Martime Southeast Asia. When I wasn't in Singapore I was at MIT where I got a lot of peripheral exposure to new ways in which people were understanding the world through data, and found that shift in knowledge-making both fascinating and exciting. I say this was a bright spot because I realized that there were LOTS of things I could find interesting in the world, and given that, I reasoned that there must be *something* else out there that I could do.",
            "I also admitted to myself that writing history was something that I had undertaken almost as challenge. Whereas some of my peers were clearly just born to write art history, I knew that my natural talents lay in something more analytic, likely more quantitative, and certainly less interperative. And I was like, enough of this, let's do something that is more of a natural fit for me.",
        ],
    },
    {
        id: 'any-regrets',
        type: 'string',
        q: 'Do you have any regrets?',
        a: [
            'No. Literally none.',
            "I have a much more financial and professional stability now, which I do think alleviated much of the misery I was feeling as a PhD student. On top of this, I genuinely love what I do! I have been able to maintain my friendships with people from my PhD program, and frankly, I'm probably a better friend now that I'm significantly happier. I have no idea if there are people from that time in my life who mostly think of me as someone who 'failed' at academia, because I honestly do not care.",
            'A less obvious question is whether I miss my field or academia at large and wish I could still engage with it somehow. The answer is no. My original instinct that I was done with my field was indeed correct. The nice thing about this is that having completely moved on from my former field has made space for me to become interested in and learn about so many new things. I feel as intellectually stimulated today as I did a a PhD student. I do attribute a lot of this to having actually done the PhD. My program in particular stressed the importance of being able to efficiently learn about and develop a high-level understanding of things that you knew nothing about, and this skill has served me incredibly well.',
        ],
    },
    {
        id: 'q5',
        type: 'do-you-wish',
        q: "Do you wish you just hadn't done the PhD, or do you wish you had dropped out?",
        a: [
            "I'll handle the easier of these two questions first. I am very very glad I finished my PhD. I hate that this is the case, but having that degree on my resume has definitely opened doors and afforded me opportunities. I also am proud to have worked through things to finish it and I learned a lot about myself through the process.",
            'As for whether I wish I had not done it, that is a hard question, but mostly I think I do not. My reasons for possibly saying yes are that I missed out on a good chunk of time to build earning power and savings, and that if I had found what I do now earlier, I would be so much more experienced at it, which would be great. However, I really truly got a lot out of my PhD, and I highly doubt I would be as good at my job as I am now without it, even though on paper there is no skill transfer. I just am a significantly better thinker. Doing my PhD also radically expanded my world view in so many ways, and I am extremely grateful for that, as it has enriched my life immeasurably.',
            'It is probably good to note that my program came with five years of funding (though no summers in my day), and I did everything I could not to come of out the program with less money than I had going into it, including teaching at other schools, applying to jillions of fellowships, and randomly going halfway around the world. If I had taken on debt I would likely feel very differently.',
        ],
    },
];

export const LEAVING_YOU: LeavingQuestion[] = [
    {
        id: 'but-i-love-scholarship',
        type: 'string',
        q: "The academic job market is decimated and/or it seems unlikley that I'll get a job that would work for me, but I want to continue with my scholarship. Any thoughts?",
        a: [
            "If you read about my experience above, you'll see that this is very much not the situation that I was in, but, I definitely know people who have been. I have one friend who published her disseratation with an academic press without being in an academic position. Anything is possible. That said, I'm not going to give advice on whether to pursue the academic job market for another year or two. I really only have two pieces of advice here.",
            "The first is to try to be as flexible in your thinking as you can. What if you had a day job that you not only performed but that you only *thought about* from 9-5, and then you slowly continued your scholarship in the evenings? Would that work? I would encourage people not to restrain their imaginations because they think that a situation isn't possible. My experience is that there are *so* many opportunities outside of academia, and the scarcity mindset that academia instills really does you a disservice once you start looking beyond its walls.",
            "My second piece of advice is really to try to be honest with yourself about what will allow you to have a happy life, and to prioritize that. If you are unhappy, will getting a TT job solve your problems, or will it solve some and introduce new ones? My hunch is that for most people, a particular position isn't going to make them happy. Meaningful work, meaningful relationships, helping others, and yes, financial security, etc. at large seem much more closely related to happiness, and there are so many different ways to achieve those things. (Not just the one way valorized in academia.) Explore them without judgment!",
        ],
    },
    {
        id: 'where-to-start',
        type: 'html',
        q: "I'm definitely contemplating trying to find work outside of academia, but I have no idea how or where to start. Any suggestions?",
        a: [],
    },
    {
        id: 'what-else-besides-talking',
        type: 'html',
        q: 'Okay, I am talking to people. But...how do I know what to pursue? What else can I do?',
        a: [],
    },
    {
        id: 'getting-a-job-no-experience',
        type: 'html',
        q: 'I feel like I have an idea about what I want to do but I have no idea how to actually get a job / getting a job with no experience feels impossible. Help!',
        a: [],
    },
    {
        id: 'tldr',
        type: 'html',
        q: 'Can you just give me your big takeaways in bullet point form? :)',
        a: [],
    },
];
