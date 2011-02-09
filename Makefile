# Cupd targets
# ------------

SITE=../cupd_site/

run:
	node app/cupd.js


# Cupd documentation
#-------------------

gendoc:
	make -C doc/ clean html
	make -C doc/ latexpdf

opendoc:
	open doc/_build/html/index.html

openpdf:
	open doc/_build/latex/Cupd.pdf

# Cupd website targets
# --------------------

copydoc: gendoc
	cp -R doc/_build/html/* $(SITE)/doc/
	cp doc/_build/latex/Cupd.pdf $(SITE)/doc/


update: copydoc
	cd $(SITE); \
	git add . ; \
	git commit -a -m "update website" ; \
	git push
