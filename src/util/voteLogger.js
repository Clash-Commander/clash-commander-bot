const Topgg = require('@top-gg/sdk');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

const webhook = new Topgg.Webhook("VRDD3aeraT4Q7Sn5U3S_zPq6nHepxwfyRZkLqRD")

module.exports = async function startAPI () {
    app.post('/dblwebhook', webhook.listener(async (vote) => {
    console.log(vote)
    
        let userdata = null;
        await axios({
            method: 'get',
            url: `https://japi.rest/discord/v1/user/${vote.user}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }).then((res) => {
            userdata = res.data.data;
        }).catch((err) => { console.log(err) });
    
        await axios({
            method: 'post',
            url: `${process.env.WEBHOOKVOTE }`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            data: {
                embeds: [
                    {
                        title: `${userdata.tag} voted for us`,
                        description: `Thanks <@${vote.user}> for [voting for Clash Commander on Top.gg](https://top.gg/bot/1057995097167368222/vote)\n\n[Vote Now!](https://top.gg/bot/1057995097167368222/vote)\n\nVoting only takes 30 seconds and helps us keep making updates to Clash Commander!`,
                        color: 16724838
                    }
                ],
                avatar_url: userdata.avatarURL || null,
                username: `${userdata.tag}`,
            }
        }).then((data) => {
            return data;
        });
    
    }));
    
    app.listen(65535);
    
}
