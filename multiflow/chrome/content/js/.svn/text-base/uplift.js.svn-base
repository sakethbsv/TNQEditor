/*    This file is part of MuLTiFlow.

      MuLTiFlow is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.

      MuLTiFlow is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.

      You should have received a copy of the GNU General Public License
      along with MuLTiFlow.  If not, see <http://www.gnu.org/licenses/>.
*/

var m5 = new MLiFlow();
	function MLiFlow() {
    this.upliftDoc = function() {
	var doc = m$.Editor().contentDocument.body;
	function removeDivs(doc) {
	    //--Remove all div tags---
	    var html = $(doc).html();
	    html = html.replace(/<div\s[^<>]*>/gi,"");
	    html = html.replace(/<\/?div>/gi,"");
	    html = html.replace(/<\/span><span\sclass=\"au\">(<span\sstyle)/gi,"$1");
	    $(doc).html(html);
	}
 
	function upliftParasToDivs(doc) {
	    function uplift(doc,start,end,wrap) {
		  $(doc).find(start).each(function() {
			$(this).add($(this).nextUntil(end)).wrapAll(wrap);
		    });
	    }
	    function upliftSections() {
	    //--SecA Group--
	    uplift(doc,'p.SectionA','p.SectionA,p.AcknowledgmentTitle,p.Acknowledgment',"<div class='sec'/>");
	    //--SecB Group--
	    uplift(doc,'p.SectionB','p.SectionA,p.SectionB,p.AcknowledgmentTitle,p.Acknowledgment',"<div class='sec'/>");
	    //--SecC Group--
	    uplift(doc,'p.SectionC','p.SectionA,p.SectionB,p.SectionC,p.AcknowledgmentTitle,p.Acknowledgment',"<div class='sec'/>");
	    //--Paragraph Group--
	    uplift(doc,'p.Paragraph','p.Paragraph,p.SectionA,p.SectionB,p.SectionC,p.AcknowledgmentTitle,p.Acknowledgmentp.FigCaption,p.TableCaption',"<div class='p_'/>");
	    //Acknowledgment Group
	    uplift(doc,'p.AcknowledgmentTitle','p[class!=Acknowledgment]',"<div class='ack'/>");
	    $(doc).find("p.SectionA,p.SectionB,p.SectionC,p.SectionD,p.AbstractTitle,p.AcknowledgmentTitle").wrap("<div class='title'/>");
	    $(doc).find("p.Acknowledgment").wrap("<div class='p_'/>");
	    }	
	     function upliftLists() {
	    //--ListA Group--
	    uplift(doc,'p[class!=ListA,ListB,ListC]+p.ListA','p.ListA,p.SectionA,p.SectionB,p.SectionC,p.SectionD,p.Paragraph',"<div class='p_'><div class='list'/></div>");
	    //--ListB Group--
	    uplift(doc,'p[class!=ListB]+p.ListB','div.p_,p.SectionA,p.SectionB,p.SectionC,p.SectionD,p.Paragraph,p.ListA,div.list,div.list-item,div.p',"<div class='list-item'><div class='list'/></div>");
	    //--ListC Group--
	    uplift(doc,'p[class!=ListC]+p.ListC','p.SectionA,p.SectionB,p.SectionC,p.SectionD,p.Paragraph,p.ListA,div.list,div.list-item,div.p,p.ListB',"<div class='list-item'><div class='list'/></div>");
	    //--ListD Group--
	    uplift(doc,'p[class!=ListD]+p.ListD','p.SectionA,p.SectionB,p.SectionC,p.SectionD,p.Paragraph,p.ListA,div.list,div.list-item,div.p,p.ListB,p.ListC',"<div class='list-item'><div class='list'/></div>");
	    $(doc).find("p.ListA,p.ListB,p.ListC,p.ListD").wrap("<div class='list-item'><div class='p_'/></div>");
	    }
	    //--Article Group--
	    uplift(doc,'p.ArticleTitle','p.ArticleTitle',"<div class='article'/>");
	    //--Head Group--
	    uplift(doc,'p.ArticleTitle','p.SectionA,p.Paragraph',"<div class='front'><div class='article-meta'/></div>");
	    //--Body Group--
	    uplift(doc,'div.front+p','p.BibTitle,p.Acknowledgment,p.AcknowledgmentTitle',"<div class='body_'/>");       
	    //--Tail Group--	
	    uplift(doc,'div.body_+p','p.EndOfDocument',"<div class='back'/>");
	    //--References Group--
	    uplift(doc,'p[class!=Bibitem]+p.Bibitem',"p[class!=Bibitem]","<div class='ref-list'/>");
	    uplift(doc,'p.Bibitem','*',"<div class='ref'><div class='nlm-citation'/></div>");
	    //--Author Group--
	    uplift(doc,'p.Authors','p.Authors,p.AbstractTitle,p.AbstractPara,p.SectionA,p.Paragraph,p.Footnote',"<div class='contrib-group'/>");    	    
	  	
	  	//--Abstract Group--
	    uplift(doc,'p.AbstractTitle','p[class!=AbstractPara]',"<div class='abstract'/>");
	    //--Sections Group--
	    upliftSections();
	    //--List Group--
	    upliftLists();
	    //-Box Group--
	    uplift(doc,'p.Boxtitle','p.Boxtitle',"<div class='boxed-text'/>");
	    //--Tbl Group--
	    uplift(doc,'p.TableCaption', 'p.TableCaption,p.Paragraph',"<div class='table-wrap'/>");
	    //--Tbl FootnoteGroup--
	    uplift(doc,'p.TableFootnote','p[class^!="TableFootnote"]',"<div class='table-wrap-foot'/>");
	   	//--Fig Group--							
	    //uplift(doc,'p.FigCaption','p[class!=FigCaption]',"<div class='fig'/>");
	    //--Article Title Group--
	    uplift(doc,'p.ArticleTitle',"*","<div class='title-group'><div class='article-title'/></div>");
	    //--Authors Group--
      $(doc).find("sup>a").each(function(){
	    var attname = $(this).attr('href');    	
	    $(this).replaceWith("<a href='"+attname+"'><sup>"+ this.innerHTML+"<\/sup><\/a>");	
	    });
	    $(doc).find("sup>u").each(function(){	       	
	    $(this).replaceWith("<u><sup>"+ this.innerHTML+"<\/sup><\/u>");	
	    });
	    $(doc).find("span.au>sup").each(function(){	      	
	    $(this).replaceWith(""+this.innerHTML+"");	
	    });	    	  	      	       	    
	    $(doc).find("span[class]").each(function(){
	    	var attname = $(this).attr('class');
	     	if(attname.match(/^au$/)) {
					$(this).replaceWith("<name>" + this.innerHTML + "</name>");					
				}
				else if(attname.match(/^affncountry$/)) {
					$(this).replaceWith("<country>" + this.innerHTML + "</country>");
				}
				else if(attname.match(/^affninst$/)) {
					$(this).replaceWith("<institution>" + this.innerHTML + "</institution>");
				}				
				else {
				$(this).replaceWith("<" + attname + ">" + this.innerHTML + "</" + attname + ">");
				}
			});
			uplift(doc,'p.Bibitem>name:nth-child(2)',"span[class!=name],stl,atl,adate,fp,lp,vol,iss","<span class='person-group'/>");
			uplift(doc,'div.contrib-group name',"*","<contrib/>");
	    //$(doc).find("p.FigCaption").contents().filter(function(){ return this.nodeType != 1; }).wrap("<caption><p_/></caption>");
			$(doc).find("p.TableCaption").contents().filter(function(){ return this.nodeType != 1; }).wrap("<caption><p_/></caption>");
			uplift(doc,'p.contrib-group span.name',"*","<span class='contrib'/>");
			$(doc).find("name").contents().filter(function(){ return this.nodeType != 1; }).wrap("<given-names/>");					
			$(doc).find("span[style]").each(function(){
	     	var colsurname = $(this).attr('style');
				if(colsurname.match(/color: rgb\(204, 255, 205\)\;/)) {
				$(this).replaceWith("<surname>" + this.innerHTML+ "</surname>");
			}			 
			});						
	   
	    //--Affiliation Group--
	    uplift(doc,'p.Affiliation',"*","<div class='aff'/>");
	    //--Affiliation Group--
	    uplift(doc,'p.keywordsdefault',"*","<div class='kwd-group'/>");
	    //--Paragraph --
	    $(doc).find("p.AbstractPara").wrap("<div class='p_'/>");
	    $(doc).remove("u");
	    //Footnotes Group--
	    uplift(doc,'div+p.Footnote','p[class!="Footnote"]',"<div class='fn-group'/>");
	    uplift(doc,'p.Footnote','*',"<div class='fn'><div class='p_'></div>");	   
	    $(doc).find("a[href]").each(function(){
	    	var href = $(this).attr('href');
	    	var href1 = $(this).attr('href');
	    	if(href.match(/^aff/)) {
				$(this).replaceWith("<xref ref-type='aff' rid='"+href+"'>" + this.innerHTML + "</xref>");
				}
				else if(href.match(/^fn/)) {
				$(this).replaceWith("<xref ref-type='fn' rid='"+href+"'>" + this.innerHTML + "</xref>");
				}
				else if(href.match(/^cor/)) {
				$(this).replaceWith("<xref ref-type='corresp' rid='"+href+"'>" + this.innerHTML + "</xref>");
				}
				else if(href.match(/^bib/)) {
				$(this).replaceWith("<xref ref-type='bibr' rid='"+href+"'>" + this.innerHTML + "</xref>");
				}
				else if(href.match(/^fig/)) {
				$(this).replaceWith("<xref ref-type='fig' rid='"+href+"'>" + this.innerHTML + "</xref>");
				}
				else if(href.match(/^/)) {
					$(this).replaceWith("<xref ref-type='" + href + "'>" + this.innerHTML + "</xref>");
				}				
				else {
				$(this).replaceWith("<link xlink:href='" + href + "'>" + this.innerHTML + "</link>");
				}
			});			
			$(doc).find("a[name]").each(function(){
	     	var id = $(this).attr('name');
			if(id.match(/^(aff|bib|fn|fig|tab)/)) {
				$(this).replaceWith("<label id='" + id + "'>" + this.innerHTML+ "</label>");
			}
			else {
				$(this).replaceWith("<link xlink:href='" + id + "'>" + this.innerHTML + "</link>");
			}
			});
			uplift(doc,'contrib "name:first-child"',"xref,name","<name/>");
			$(doc).find("name>name").unwrap();
			$(doc).find("name>sup").unwrap();
					
			$(doc).find("a[id]").each(function(){
	     	var href = $(this).attr('href');
			$(this).replaceWith("<label>" + this.innerHTML + "</label>")
			});			
			
			$(doc).find("i").each(function(){	      	
	    $(this).replaceWith("<italic>"+this.innerHTML+"</italic>");	
	    });
	    
	    $(doc).find("b").each(function(){	      	
	    $(this).replaceWith("<bold>"+this.innerHTML+"</bold>");	
	    });
	    
	    //References
	    $(doc).find("adate").each(function(){	      	
	    $(this).replaceWith("<year>"+this.innerHTML+"</year>");	
	    });
	    
	    $(doc).find("first-page").each(function(){	      	
	    $(this).replaceWith("<fpage>"+this.innerHTML+"</fpage>");	
	    });
	    
	    $(doc).find("last-page").each(function(){	      	
	    $(this).replaceWith("<lpage>"+this.innerHTML+"</lpage>");	
	    });
	    $(doc).find("biblabel").each(function(){	      	
	    $(this).replaceWith(""+this.innerHTML+"");	
	    });
	   	  
			//--Remove span with style attribute
			$(doc).find("[style]").removeAttr("style");
			
	    //--Remove x tags	    
      m$.logMessage("hello");  
	    }
	    
	 

	function upliftTags(doc) {
	    function uplift(doc,start,end,wrap) {
		$(doc).find(start).each(function() {
			$(this).add($(this).nextUntil(end)).wrapAll(wrap);
		    });
	    }
	    //--Author group
	    uplift(doc,'au:first-child,a+x+au',"stl,atl,date,fp,lp,vol,iss,a","<aug/>");
	    //--Editor group
	    uplift(doc,'ed:first-child,a+x+ed',"stl,atl,date,fp,lp,vol,iss,a","<edg/>");	
	}
	
	


	function replaceTagByTag(doc,tm) {
	    for(var f in tm)  {
		$(doc).find(f).each(function() {
			$(this).replaceWith(function() {
				var tag = tm[f].split('@').toString().replace(/,/g," ");
				return "<" + tag + ">" + $(this).html() + "</" + tag + ">";
			    });
		    });
	    }
	}

	removeDivs(doc);
	upliftParasToDivs(doc);
	upliftTags(doc);

	//--Replace TUX character styles elements with NLM elements
	var tud2nlm = { atl: "article-title", stl: "source_" , btl: "source_", fnm: "given-names", snm: "surname", au: "name" , aug: "contrib-group@type='author'", edg: "contrib-group@type='editor'", pub: "publisher-name", place: "publisher-loc", city: "publisher-loc", iss: "issue-number", vol: "volume", rem: "comment", topic: "subject", pgs: "page-range", deg: "degrees", rol: "prefix", inst: "institution"};
	replaceTagByTag(doc,tud2nlm);
	if(m$.getGeckoVersion() < 2) { m$.convertMath(doc); }
	
	
    }
	
  this.removeDivs = function() {
	var doc = m$.Editor().contentDocument.body;
	//--Remove all div tags---
	var html = $(doc).html();
	html = html.replace(/<div\s[^<>]*>/gi,"");
	html = html.replace(/<\/?div>/gi,"");
	//html = html.replace(/<aff><aff/g,"<aff");
	html = html.replace(/<(\/)?m/g,"<$1mml:m");
	html = html.replace(/=\"#/g,"=\"");	
	//html = html.replace(/<\/p><p><list>/g,"<list>");
	$(doc).html(html);
	m$.convertMath(doc);
    }
    /*---end-of-multiflow--*/
	}