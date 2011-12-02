<?xml version="1.0" encoding="utf-8"?>
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

  <!--Style name versus ID mapping-->

    <xsl:template match="w:style">
      <a id="{@w:styleId}"><xsl:apply-templates select="w:name/@w:val"/></a>
    </xsl:template>
    

</xsl:stylesheet>
