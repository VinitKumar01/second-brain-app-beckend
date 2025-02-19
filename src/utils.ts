import { YoutubeTranscript } from 'youtube-transcript';
import gemini from './ai';
import axios from "axios";
import * as cheerio from "cheerio";

export function random(len: number) {
    let options = "qwertyuioasdfghjklzxcvbnm12345678";
    let length = options.length;

    let ans = "";

    for (let i = 0; i < len; i++) {
        ans += options[Math.floor((Math.random() * length))] // 0 => 20
    }

    return ans;
}

async function getYouTubeTranscript(videoUrl: string): Promise<string> {
    try {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        const transcriptEntries = await YoutubeTranscript.fetchTranscript(videoId);
        
        if (!transcriptEntries || transcriptEntries.length === 0) {
            throw new Error('No transcript available for this video');
        }

        // Combine all text entries
        const fullTranscript = transcriptEntries
            .map(entry => entry.text)
            .join(' ');

        return fullTranscript;
    } catch (error) {
        throw new Error(`Failed to fetch transcript: ${error}`);
    }
}

function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^\/]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^\/]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

export const summarisedVideo = (videoUrl:string) => getYouTubeTranscript(videoUrl)
    .then(transcript => gemini('give me summary of the following transcript in such a way firstly summarise every 250 words in detail (or summary should conclude all the words without leaving anything, it can be long) from the transcript and then merge the summary of all these 250 words sumaries into a single but long paragraph. give me only merged summary. \n\n' + transcript).then(result => result))
    .catch(error => console.error('Error:', error.message));



async function extractTweetContent(tweetUrl: string): Promise<string | null> {
    try {
        const response = await axios.get("https://publish.twitter.com/oembed", {
            params: { url: tweetUrl }
        });
        
        if (response.data && response.data.html) {
            const tweetHtml: string = response.data.html;
            const $ = cheerio.load(tweetHtml);
            return $("body").text().trim();
        }
    } catch (error) {
        console.error("Error fetching tweet content:", error);
    }
    return null;
}

// Example usage
export const tweet = (tweetUrl:string) => extractTweetContent(tweetUrl).then(content => content)
.catch(error => console.error('Error:', error.message));
