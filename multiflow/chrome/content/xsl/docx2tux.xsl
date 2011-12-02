<?xml version="1.0" encoding="utf-8"?>
<!--
    This file is part of MuLTiFlow.

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
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:ve="http://schemas.openxmlformats.org/markup-compatibility/2006" 
		xmlns:o="urn:schemas-microsoft-com:office:office" 
		xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
		xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" 
		xmlns:v="urn:schemas-microsoft-com:vml" 
		xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" 
		xmlns:w10="urn:schemas-microsoft-com:office:word" 
		xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
		xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
		xmlns:tnq="http://www.tnq.co.in/m5/tux"
		xmlns:xs="http://www.w3.org/2001/XMLSchema"
		xmlns:str="http://exslt.org/strings"
		version="1.0">

  <xsl:template match="/">
    <html>
      <body>
	<div class='allText'>
	  <xsl:apply-templates/>
	</div>
      </body>
    </html>
  </xsl:template>

  <!--Paragraph styles-->

  <xsl:template match="w:p[w:pPr/w:pStyle/@w:val]">
    <p class="{w:pPr/w:pStyle/@w:val}"><xsl:apply-templates/></p>
  </xsl:template>
  
  <xsl:template match="w:p">
    <p><xsl:apply-templates/></p>
  </xsl:template>

  <!--Table Conversions-->

  <xsl:template match="w:tbl">
    <table frame="topbot"><xsl:apply-templates/></table>
  </xsl:template>

  <xsl:template match="w:tr">
    <tr><xsl:apply-templates/></tr>
  </xsl:template>

  <xsl:template match="w:tc[w:tcPr/w:vMerge[count(@*) = 0]]"/>

  <xsl:template match="w:tc[../child::w:trPr/w:tblHeader]">
    <th><xsl:apply-templates/></th>
  </xsl:template>

  <xsl:template match="w:tc">
    <td><xsl:apply-templates/></td>
  </xsl:template>


  <!--Format conversions-->

  <xsl:template match="w:r[w:rPr/w:rStyle/@w:val]">
    <xsl:element name="{w:rPr/w:rStyle/@w:val}"><xsl:apply-templates/></xsl:element>
  </xsl:template>

  <xsl:template match="w:r">
    <xsl:choose>
      <xsl:when test="preceding-sibling::*[1][self::w:bookmarkStart]"/>
      <xsl:when test="w:rPr/w:b and w:rPr/w:i and w:rPr/w:vertAlign/@w:val='superscript'">
	<sup><b><i><xsl:apply-templates/></i></b></sup>
      </xsl:when>
      <xsl:when test="w:rPr/w:b and w:rPr/w:i and w:rPr/w:vertAlign/@w:val='subscript'">
	<sub><b><i><xsl:apply-templates/></i></b></sub>
      </xsl:when>
      <xsl:when test="w:rPr/w:b and w:rPr/w:i and w:rPr/w:vertAlign/@w:val!='superscript'">
	<sup><b><i><xsl:apply-templates/></i></b></sup>
      </xsl:when>
      <xsl:when test="w:rPr/w:b and w:rPr/w:vertAlign/@w:val='superscript'">
	<sup><b><xsl:apply-templates/></b></sup>
      </xsl:when>
      <xsl:when test="w:rPr/w:b and w:rPr/w:vertAlign/@w:val='subscript'">
	<sub><b><xsl:apply-templates/></b></sub>
      </xsl:when>
      <xsl:when test="w:rPr/w:i and w:rPr/w:vertAlign/@w:val='superscript'">
	<sup><i><xsl:apply-templates/></i></sup>
      </xsl:when>
      <xsl:when test="w:rPr/w:i and w:rPr/w:vertAlign/@w:val='subscript'">
	<sub><i><xsl:apply-templates/></i></sub>
      </xsl:when>
      <xsl:when test="w:rPr/w:b">
	<b><xsl:apply-templates/></b>
      </xsl:when>
      <xsl:when test="w:rPr/w:i">
	<i><xsl:apply-templates/></i>
      </xsl:when>
      <xsl:when test="w:rPr/w:vertAlign/@w:val='superscript'">     
	<sup><xsl:apply-templates/></sup>
      </xsl:when>
      <xsl:when test="w:rPr/w:vertAlign/@w:val='subscript'">     
	<sub><xsl:apply-templates/></sub>
      </xsl:when>
      <xsl:otherwise>
	<xsl:apply-templates/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!--Hyperlinks-->

  <xsl:template match="w:hyperlink[@w:anchor]">
    <a href="#{@w:anchor}"><xsl:apply-templates/></a>
  </xsl:template>

  <xsl:template match="w:bookmarkStart[@w:name]">
    <a name="{@w:name}"><xsl:apply-templates select="following-sibling::w:r[1]"/></a>
  </xsl:template>

  <!--oMath-->

  <xsl:template match="m:oMath">
    <math><xsl:apply-templates/></math>
  </xsl:template>

  <xsl:template match="m:r">
      <mrow><xsl:apply-templates/></mrow>
  </xsl:template>

  <xsl:template match="m:f[m:fPr/m:type/@m:val='noBar']">
    <mfrac linethickness="0">			
      <mrow><xsl:apply-templates select="m:num" /></mrow>
      <mrow><xsl:apply-templates select="m:den" /></mrow>
    </mfrac>
  </xsl:template>

  <xsl:template match="m:f">
    <mfrac>			
      <mrow><xsl:apply-templates select="m:num" /></mrow>
      <mrow><xsl:apply-templates select="m:den" /></mrow>
    </mfrac>
  </xsl:template>

  <xsl:template match="m:f">
    <mfrac>			
      <mrow><xsl:apply-templates select="m:num" /></mrow>
      <mrow><xsl:apply-templates select="m:den" /></mrow>
    </mfrac>
  </xsl:template>

  <xsl:template match="m:t[translate(.,'0123456789','')='']">
    <mn><xsl:apply-templates/></mn>
  </xsl:template>

  <xsl:template match="m:t[translate(.,'+-=','')='']">
    <mo><xsl:apply-templates/></mo>
  </xsl:template>

  <xsl:template match="m:t[translate(.,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ','')='']">
    <mi><xsl:apply-templates/></mi>
  </xsl:template>
  
  <xsl:template match="m:t[ancestor::m:r[1]/m:rPr[1]/m:scr/@m:val]">
    <xsl:variable name="sty" select="ancestor::m:r[1]/m:rPr[1]/m:sty/@m:val"/>
    <xsl:variable name="style">
      <xsl:choose>
	<xsl:when test="$sty='b'">
	  <xsl:text>bold</xsl:text>
	</xsl:when>
	<xsl:when test="$sty='i'">
	  <xsl:text>italic</xsl:text>
	</xsl:when>
	<xsl:when test="$sty='bi'">
	  <xsl:text>bold-italic</xsl:text>
	</xsl:when>
	<xsl:otherwise>
	  <xsl:text>normal</xsl:text>
	</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="scr">
      <xsl:value-of select="ancestor::m:r[1]/m:rPr[1]/m:scr/@m:val" />
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$scr!='' and $style!='normal'">
	<mi mathvariant="{$style}-{$scr}"><xsl:apply-templates/></mi>
      </xsl:when>
      <xsl:when test="$scr!='' and $style='normal'">
	<mi mathvariant="{$scr}"><xsl:apply-templates/></mi>
      </xsl:when>
      <xsl:when test="$scr='' and $style!='normal'">
	<mi mathvariant="{$style}"><xsl:apply-templates/></mi>
      </xsl:when>
      <xsl:otherwise>
	<mi><xsl:apply-templates/></mi>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>


  <xsl:template match="m:t">
    <mrow>
      <xsl:for-each select="str:tokenize(.,'')">
	<xsl:choose>
	  <xsl:when test="translate(.,'+-=','')=''">
	    <mo><xsl:apply-templates/></mo>
	  </xsl:when>
	  <xsl:when test="translate(.,'0123456789','')=''">
	    <mn><xsl:apply-templates/></mn>
	  </xsl:when>
	  <xsl:otherwise>
	    <mi><xsl:apply-templates/></mi>
	  </xsl:otherwise>
	</xsl:choose>
      </xsl:for-each>
    </mrow>
  </xsl:template>

  <xsl:template match="m:acc"> 
    <mover accent="true">
      <xsl:apply-templates select="m:e" /> 
      <mtext>
	<xsl:choose>
	  <xsl:when test="not(m:accPr[1]/m:chr/@m:val)">
	    <xsl:value-of select="'&#x0302;'" /> 
	  </xsl:when>
	  <xsl:otherwise>
	    <xsl:value-of select="m:accPr[1]/m:chr/@m:val" />
	  </xsl:otherwise>
	</xsl:choose>
      </mtext>
    </mover>
  </xsl:template>

  <xsl:template match="m:sPre">
    <mmultiscripts>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mprescripts />
      <mrow><xsl:apply-templates select="m:sub" /></mrow>
      <mrow><xsl:apply-templates select="m:sup" /></mrow>
    </mmultiscripts>
  </xsl:template>

  <xsl:template match="m:m">
    <mtable><xsl:apply-templates/></mtable>
  </xsl:template>

  <xsl:template match="m:mr">
    <mtr><xsl:apply-templates/></mtr>
  </xsl:template>

  <xsl:template match="m:e[parent::m:mr]">
    <mtd><xsl:apply-templates/></mtd>
  </xsl:template>


  <xsl:template match="m:phant">
    <xsl:variable name="LowerCaseWidthValue" select="translate(m:phantPr[last()]/m:width/@m:val, 
						     'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
						     'abcdefghijklmnopqrstuvwxyz')" />
    <xsl:variable name="LowerCaseAscValue" select="translate(m:phantPr[last()]/m:asc/@m:val, 
						   'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
						   'abcdefghijklmnopqrstuvwxyz')" />
    <xsl:variable name="LowerCaseDecValue" select="translate(m:phantPr[last()]/m:dec/@m:val, 
						   'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
						   'abcdefghijklmnopqrstuvwxyz')" />
    <xsl:if test="not($LowerCaseWidthValue='off' and $LowerCaseAscValue='off'   and $LowerCaseDecValue='off')">
      <phantom>				
	<xsl:apply-templates select="m:e" />
      </phantom>
    </xsl:if>
  </xsl:template>

  <xsl:template match="m:rad"> 
    <xsl:variable name="LowerCaseDegHideValue" select="translate(m:radPr[last()]/m:degHide/@m:val, 
						       'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
						       'abcdefghijklmnopqrstuvwxyz')" />
    <xsl:choose>
      <xsl:when test="$LowerCaseDegHideValue='on'"> 
	<msqrt><xsl:apply-templates select="m:e" /></msqrt>
      </xsl:when>
      <xsl:otherwise> 
	<mroot>
	  <mrow><xsl:apply-templates select="m:e" /></mrow>
	  <mrow><xsl:apply-templates select="m:deg" /></mrow>
	</mroot>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="m:limLow">
    <munder>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:lim" /></mrow>
    </munder>
  </xsl:template>

  <xsl:template match="m:limUpp">
    <mover>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:lim" /></mrow>
    </mover>
  </xsl:template>

  <xsl:template match="m:sSub">
    <msub>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:sub" /></mrow>
    </msub>		
  </xsl:template>

  <xsl:template match="m:sSup">
    <msup>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:sup" /></mrow>
    </msup>		
  </xsl:template>

  <xsl:template match="m:sSubSup">
    <msubsup>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:sub" /></mrow>
      <mrow><xsl:apply-templates select="m:sup" /></mrow>
    </msubsup>
  </xsl:template>


  <xsl:template match="m:func">
    <mrow>
      <mrow><xsl:apply-templates select="m:fName" /></mrow>
      <mo>&#x02061;</mo>
      <xsl:apply-templates select="*[position() &gt; 1]" />
    </mrow>
  </xsl:template>

  <xsl:template match="m:nary[m:sub and m:sup]">
    <munderover>
      <mi><xsl:value-of select="m:naryPr/m:chr/@m:val"/></mi>
      <mrow><xsl:apply-templates select="m:sub" /></mrow>
      <mrow><xsl:apply-templates select="m:sup" /></mrow>
    </munderover>
    <mrow><xsl:apply-templates select="m:e" /></mrow>
  </xsl:template>

  <xsl:template match="m:nary[m:sub]">
    <munder>
      <mi><xsl:value-of select="m:naryPr/m:chr/@m:val"/></mi>
      <mrow><xsl:apply-templates select="m:sub" /></mrow>
    </munder>
    <mrow><xsl:apply-templates select="m:e" /></mrow>
  </xsl:template>

  <xsl:template match="m:nary[m:sup]">
    <mover>
      <mi><xsl:value-of select="m:naryPr/m:chr/@m:val" /></mi>
      <mrow><xsl:apply-templates select="m:sup" /></mrow>
    </mover>
    <mrow><xsl:apply-templates select="m:e" /></mrow>
  </xsl:template>

  <xsl:template match="m:groupChar[m:groupChrPr/m:vertJc/@m:val='top']">
    <mover>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:groupChrPr/m:chr/@m:val" /></mrow>
    </mover>
  </xsl:template>

  <xsl:template match="m:groupChar[m:groupChrPr/m:vertJc/@m:val='bot']">
    <munder>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
      <mrow><xsl:apply-templates select="m:groupChrPr/m:chr/@m:val" /></mrow>
    </munder>
  </xsl:template>

  <xsl:template match="m:d[m:dPr/m:begChr/@m:val]">
    <mfenced open="{m:dPr/m:begChr/@m:val}" close="{m:dPr/m:endChr/@m:val}">
      <mrow><xsl:apply-templates select="m:e" /></mrow>
    </mfenced>
  </xsl:template>

  <xsl:template match="m:d">
    <mfenced>
      <mrow><xsl:apply-templates select="m:e" /></mrow>
    </mfenced>
  </xsl:template>
  <xsl:template match="m:bar[m:barPr/m:pos/@m:val='top']">
    <mover accent="true">
      <mrow><xsl:apply-templates select="m:e"/></mrow>
      <mo>&#xAF;</mo>
    </mover>
  </xsl:template>

  <xsl:template match="m:bar[m:barPr/m:pos/@m:val='bot']">
    <munder>
      <mrow><xsl:apply-templates select="m:e"/></mrow>
      <mo>&#x332;</mo>
    </munder>
  </xsl:template>

</xsl:stylesheet>
