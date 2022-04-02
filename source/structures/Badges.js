let badges = {"owner":"https://media.discordapp.net/attachments/689800301468713106/844904063619694592/review.png","review":"https://media.discordapp.net/attachments/689800301468713106/822793098361831456/444.png","union":"https://media.discordapp.net/attachments/689800301468713106/807310152801845358/-3.png","attentive":"https://media.discordapp.net/attachments/689800301468713106/827475184273063936/222.png","partner_3":"https://media.discordapp.net/attachments/689800301468713106/811015503648784424/41.png","prm_exc":"https://cdn.discordapp.com/attachments/728932829026844672/872891776510357514/prm_exc.png","complaint":"https://media.discordapp.net/attachments/689800301468713106/827468466168266772/123124.png","boost":"https://media.discordapp.net/attachments/689800301468713106/797122464026198066/rm.png","partner_1":"https://media.discordapp.net/attachments/689800301468713106/811015500712509490/6.png","partner_2":"https://media.discordapp.net/attachments/689800301468713106/811015502381187092/34.png","support":"https://media.discordapp.net/attachments/689800301468713106/858314782292836362/-4.png","chat":"https://media.discordapp.net/attachments/689800301468713106/817425102671970304/333333.png","partner_m":"https://media.discordapp.net/attachments/689800301468713106/811015504348708914/52.png","developer":"https://media.discordapp.net/attachments/689800301468713106/844904098180759562/review.png","debug":"https://cdn.discordapp.com/attachments/728932829026844672/875865080854614157/341.png","feb_14":"https://media.discordapp.net/attachments/689800301468713106/806296162889891890/review.png","feedback":"https://cdn.discordapp.com/attachments/728932829026844672/872891775625359461/feedback.png","glitch":"https://media.discordapp.net/attachments/689800301468713106/822793093857148938/-11.png","hero_kc":"https://media.discordapp.net/attachments/689800301468713106/814131510361587762/medal.png","new_year":"https://media.discordapp.net/attachments/689800301468713106/797119577951436810/rm.png","idea":"https://media.discordapp.net/attachments/689800301468713106/824420601309167676/-12.png","moder":"https://media.discordapp.net/attachments/689800301468713106/827468464809443358/12qw3erythkjk.png","20k":"https://media.discordapp.net/attachments/689800301468713106/841016627255312384/badge.png","gm":"https://media.discordapp.net/attachments/689800301468713106/858314757907152896/werr.png","prm":"https://cdn.discordapp.com/emojis/858767092031029258.png?v=1","gprm":"https://media.discordapp.net/attachments/689800301468713106/858766975818530826/sdff.png","head_sp":"https://media.discordapp.net/attachments/689800301468713106/858766977027407892/sddd.png","designer":"https://media.discordapp.net/attachments/689800301468713106/863353858389311498/design.png","head_des":"https://media.discordapp.net/attachments/689800301468713106/863353859941072936/design1.png","2_years":"https://cdn.discordapp.com/emojis/871442290768502814.png?v=1","debug+":"https://cdn.discordapp.com/attachments/728932829026844672/875865012101611570/314.png","debugger":"https://media.discordapp.net/attachments/689800301468713106/807343608868110406/review.png","new_era":"https://cdn.discordapp.com/emojis/877183992670072922.png"}
class Badges{
  constructor(user){
    this.user_id = user;
  }
  async list(){
    let [badges_list] = await con.query(`SELECT * FROM Badges WHERE User=?`,[this.user_id]),
        member = client.guilds.cache.get('604636579545219072').members.cache.get(this.user_id)||({"roles":{"cache":new Set()}}),
        list = {};
    badges_list.map(badge=>list[badge.Badge] = badges[badge.Badge])
    if(member.roles.cache.has("800474182474268734")) list['gm'] = badges['gm']
    	else if(member.roles.cache.has("677397817966198788")) list['moder'] = badges['moder']
    if(member.roles.cache.has("855163571712950272")) list['head_sp'] = badges['head_sp']
    	else if(member.roles.cache.has("816386551222763561")) list['support'] = badges['support']
    if(member.roles.cache.has("686639786672652363")) list['gprm'] = badges['gprm']
    	else if(member.roles.cache.has("608600358570295307")) list['prm'] = badges['prm']
    if(member.roles.cache.has("769916590686732319")) list["partner_m"] = badges['partner_m']
    	else if(member.roles.cache.has("622501691107049502")) list["partner_3"] = badges['partner_3']
    		else if(member.roles.cache.has("622501656591990784")) list["partner_2"] = badges['partner_2']
    			else if(member.roles.cache.has("688654966675603491")) list["partner_1"] = badges['partner_1']
     return list
  }
}
module.exports = Badges